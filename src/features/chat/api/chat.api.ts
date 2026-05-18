import { apiClient } from '@/src/lib/api/client'
import type {
  ChatSummary,
  ChatMessage,
  ChatMessagesPage,
  MessageSendRequest,
  DirectChatRequest,
  GroupChatCreateRequest,
} from '../types'

export const chatApi = {
  getMyChats: (): Promise<ChatSummary[]> =>
    apiClient.get('/chats').then((res) => res.data),

  getChat: (chatId: number): Promise<ChatSummary> =>
    apiClient.get(`/chats/${chatId}`).then((res) => res.data),

  getMessages: (chatId: number, page = 0, size = 50): Promise<ChatMessagesPage> =>
    apiClient.get(`/chats/${chatId}/messages`, { params: { page, size } }).then((res) => res.data),

  sendMessage: (chatId: number, data: MessageSendRequest): Promise<ChatMessage> =>
    apiClient.post(`/chats/${chatId}/messages`, data).then((res) => res.data),

  markAsRead: (chatId: number): Promise<ChatSummary> =>
    apiClient.post(`/chats/${chatId}/read`).then((res) => res.data),

  createDirectChat: (data: DirectChatRequest): Promise<ChatSummary> =>
    apiClient.post('/chats/direct', data).then((res) => res.data),

  createGroupChat: (data: GroupChatCreateRequest): Promise<ChatSummary> =>
    apiClient.post('/chats/groups', data).then((res) => res.data),
}
