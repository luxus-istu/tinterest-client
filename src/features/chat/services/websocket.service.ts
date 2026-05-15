import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs'
import useAuthStore from '@/src/features/auth/store/auth.store'
import type { ChatMessage } from '../types'

const WS_URL =
  process.env.NODE_ENV === 'development'
    ? 'wss://localhost:8443/ws'
    : (process.env.NEXT_PUBLIC_WS_URL ?? 'wss://localhost:8443/ws')

type MessageHandler = (message: ChatMessage) => void
type ConnectionHandler = () => void
type ErrorHandler = (error: string) => void

class WebSocketService {
  private client: Client | null = null
  private messageHandlers = new Set<MessageHandler>()
  private connectHandlers = new Set<ConnectionHandler>()
  private disconnectHandlers = new Set<ConnectionHandler>()
  private errorHandlers = new Set<ErrorHandler>()
  private subscription: StompSubscription | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isManuallyDisconnected = false

  connect() {
    if (this.client?.active) return

    const token = useAuthStore.getState().accessToken
    if (!token) return

    this.isManuallyDisconnected = false

    this.client = new Client({
      brokerURL: WS_URL,
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
        this.subscribeToMessages()
        this.connectHandlers.forEach((h) => h())
      },
      onDisconnect: () => {
        this.disconnectHandlers.forEach((h) => h())
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
  }

  disconnect() {
    this.isManuallyDisconnected = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.subscription?.unsubscribe()
    this.subscription = null
    this.client?.deactivate()
    this.client = null
  }

  private subscribeToMessages() {
    if (!this.client) return

    this.subscription = this.client.subscribe(
      '/user/queue/chat',
      (message: IMessage) => {
        try {
          const parsed: ChatMessage = JSON.parse(message.body)
          this.messageHandlers.forEach((h) => h(parsed))
        } catch {
          // Skip malformed messages
        }
      },
    )
  }

  sendViaWebSocket(chatId: number, content: string) {
    this.client?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ chatId, content, type: 'TEXT' }),
    })
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
