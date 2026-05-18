import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs'
import useAuthStore from '@/src/features/auth/store/auth.store'
import type { ChatMessage, MessageSendRequest } from '../types'

const DEFAULT_WS_PATH = '/ws'

function resolveWsUrl() {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:8443'
  const url = new URL(DEFAULT_WS_PATH, apiUrl)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'

  return url.toString()
}

type MessageHandler = (message: ChatMessage) => void
type ConnectionHandler = () => void
type ErrorHandler = (error: string) => void

class WebSocketService {
  private client: Client | null = null
  private messageHandlers = new Set<MessageHandler>()
  private connectHandlers = new Set<ConnectionHandler>()
  private disconnectHandlers = new Set<ConnectionHandler>()
  private errorHandlers = new Set<ErrorHandler>()
  private subscriptions = new Map<number, StompSubscription>()
  private pendingChatIds = new Set<number>()
  private isManuallyDisconnected = false
  private unsubscribeToken: (() => void) | null = null

  connect() {
    if (this.client?.active) return

    const token = useAuthStore.getState().accessToken
    if (!token) return

    this.isManuallyDisconnected = false

    this.client = new Client({
      brokerURL: resolveWsUrl(),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      debug: (msg: string) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[WS]', msg)
        }
      },
      onConnect: () => {
        this.pendingChatIds.forEach((chatId) => this.subscribeToChat(chatId))
        this.connectHandlers.forEach((h) => h())
      },
      onDisconnect: () => {
        this.subscriptions.clear()
        this.disconnectHandlers.forEach((h) => h())
      },
      onWebSocketClose: () => {
        this.subscriptions.clear()
        if (!this.isManuallyDisconnected) {
          this.disconnectHandlers.forEach((h) => h())
        }
      },
      onStompError: (frame: IFrame) => {
        const error = frame.headers['message'] ?? 'WebSocket error'
        this.errorHandlers.forEach((h) => h(error))
      },
      onWebSocketError: () => {
        this.errorHandlers.forEach((h) => h('WebSocket connection failed'))
      },
    })

    this.client.activate()

    this.unsubscribeToken = useAuthStore.subscribe((state, prev) => {
      if (state.accessToken && state.accessToken !== prev.accessToken && this.client) {
        this.client.connectHeaders = { Authorization: `Bearer ${state.accessToken}` }
      }
    })
  }

  disconnect() {
    this.unsubscribeToken?.()
    this.unsubscribeToken = null
    this.isManuallyDisconnected = true
    this.pendingChatIds.clear()
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
    this.subscriptions.clear()
    this.client?.deactivate()
    this.client = null
  }

  subscribeToChats(chatIds: number[]) {
    chatIds.forEach((chatId) => this.subscribeToChat(chatId))
  }

  subscribeToChat(chatId: number) {
    this.pendingChatIds.add(chatId)

    if (!this.client?.connected || this.subscriptions.has(chatId)) return

    const subscription = this.client.subscribe(
      `/topic/chats/${chatId}`,
      (message: IMessage) => {
        try {
          const parsed: ChatMessage = JSON.parse(message.body)
          this.messageHandlers.forEach((h) => h(parsed))
        } catch {
          // Skip malformed messages
        }
      },
    )

    this.subscriptions.set(chatId, subscription)
  }

  sendMessage(chatId: number, data: MessageSendRequest) {
    if (!this.client?.connected) {
      return false
    }

    this.client.publish({
      destination: `/app/chats/${chatId}/messages`,
      body: JSON.stringify(data),
    })

    return true
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onConnect(handler: ConnectionHandler) {
    this.connectHandlers.add(handler)
    return () => this.connectHandlers.delete(handler)
  }

  onDisconnect(handler: ConnectionHandler) {
    this.disconnectHandlers.add(handler)
    return () => this.disconnectHandlers.delete(handler)
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  get isConnected() {
    return this.client?.connected ?? false
  }
}

export const wsService = new WebSocketService()
