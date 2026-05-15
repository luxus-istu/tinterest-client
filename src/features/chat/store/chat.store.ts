import { create } from 'zustand'
import type { ChatSummary, ChatMessage } from '../types'
import { chatApi } from '../api/chat.api'
import { wsService } from '../services/websocket.service'

interface ChatState {
  chats: ChatSummary[]
  messages: Record<number, ChatMessage[]>
  totalMessages: Record<number, number>
  hasMore: Record<number, boolean>
  selectedChatId: number | null
  isMobileList: boolean
  isLoadingChats: boolean
  isLoadingMessages: boolean
  chatsError: string | null
  messagesError: string | null
}

interface ChatActions {
  loadChats: () => Promise<void>
  selectChat: (chatId: number) => void
  goBack: () => void
  sendMessage: (text: string) => Promise<void>
  loadMessages: (chatId: number) => Promise<void>
  loadMoreMessages: (chatId: number) => Promise<void>
}

interface ChatStore extends ChatState, ChatActions {}

const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  totalMessages: {},
  hasMore: {},
  selectedChatId: null,
  isMobileList: true,
  isLoadingChats: false,
  isLoadingMessages: false,
  chatsError: null,
  messagesError: null,

  loadChats: async () => {
    set({ isLoadingChats: true, chatsError: null })
    try {
      const chats = await chatApi.getMyChats()
      set({ chats, isLoadingChats: false })

      wsService.connect()
    } catch {
      set({ chatsError: 'Не удалось загрузить чаты', isLoadingChats: false })
    }
  },

  selectChat: (chatId) => {
    set({ selectedChatId: chatId, isMobileList: false })
    const { messages } = get()
    if (!messages[chatId] || messages[chatId].length === 0) {
      get().loadMessages(chatId)
    }
  },

  goBack: () => set({ selectedChatId: null, isMobileList: true }),

  sendMessage: async (text) => {
    const { selectedChatId, chats } = get()
    if (!selectedChatId || !text.trim()) return

    const content = text.trim()
    try {
      const newMessage = await chatApi.sendMessage(selectedChatId, {
        type: 'TEXT',
        content,
      })

      set({
        messages: {
          ...get().messages,
          [selectedChatId]: [...(get().messages[selectedChatId] ?? []), newMessage],
        },
        chats: chats.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, lastMessage: newMessage, unreadCount: 0 }
            : chat,
        ),
      })
    } catch {
      set({ messagesError: 'Не удалось отправить сообщение' })
    }
  },

  loadMessages: async (chatId) => {
    set({ isLoadingMessages: true, messagesError: null })
    try {
      const page = await chatApi.getMessages(chatId, 0, 50)
      set({
        messages: { ...get().messages, [chatId]: page.content },
        totalMessages: { ...get().totalMessages, [chatId]: page.totalElements },
        hasMore: { ...get().hasMore, [chatId]: page.page < page.totalPages - 1 },
        isLoadingMessages: false,
      })
    } catch {
      set({ messagesError: 'Не удалось загрузить сообщения', isLoadingMessages: false })
    }
  },

  loadMoreMessages: async (chatId) => {
    const { messages, hasMore } = get()
    if (!hasMore[chatId]) return

    const existing = messages[chatId] ?? []
    const currentPage = Math.floor(existing.length / 50)

    try {
      const page = await chatApi.getMessages(chatId, currentPage, 50)
      set({
        messages: {
          ...get().messages,
          [chatId]: [...page.content, ...existing],
        },
        totalMessages: { ...get().totalMessages, [chatId]: page.totalElements },
        hasMore: { ...get().hasMore, [chatId]: page.page < page.totalPages - 1 },
      })
    } catch {
      // Silent fail for pagination
    }
  },
}))

wsService.onMessage((message) => {
  const state = useChatStore.getState()
  const { chats, messages, selectedChatId } = state

  const updatedChats = chats.map((chat) => {
    if (chat.id === message.chatId) {
      const isSelected = selectedChatId === message.chatId
      return {
        ...chat,
        lastMessage: message,
        unreadCount: isSelected ? 0 : chat.unreadCount + 1,
      }
    }
    return chat
  })

  useChatStore.setState({
    chats: updatedChats,
    messages: messages[message.chatId]
      ? { ...messages, [message.chatId]: [...messages[message.chatId], message] }
      : messages,
  })
})

export default useChatStore
