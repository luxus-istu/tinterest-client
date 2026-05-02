import { create } from 'zustand'
import { chats, type Chat, type Message, currentUserId } from '../mock/data'

interface ChatState {
  chats: Chat[]
  selectedChatId: string | null
  isMobileList: boolean
}

interface ChatActions {
  selectChat: (chatId: string) => void
  goBack: () => void
  sendMessage: (text: string) => void
}

interface ChatStore extends ChatState, ChatActions {}

const useChatStore = create<ChatStore>((set) => ({
  chats,
  selectedChatId: null,
  isMobileList: true,

  selectChat: (chatId) => set({ selectedChatId: chatId, isMobileList: false }),

  goBack: () => set({ selectedChatId: null, isMobileList: true }),

  sendMessage: (text) =>
    set((state) => {
      if (!state.selectedChatId || !text.trim()) return state
      const now = new Date()
      const newMessage: Message = {
        id: `m${Date.now()}`,
        chatId: state.selectedChatId,
        senderId: currentUserId,
        senderName: 'Вы',
        senderAvatar: '',
        text: text.trim(),
        timestamp: now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      return {
        chats: state.chats.map((chat) =>
          chat.id === state.selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: newMessage.text,
                lastMessageTime: newMessage.timestamp,
                lastMessageDate: now.toISOString(),
              }
            : chat,
        ),
      }
    }),
}))

export default useChatStore
