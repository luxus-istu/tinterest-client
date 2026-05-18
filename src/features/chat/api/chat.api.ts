import { apiClient } from '@/src/lib/api/client'
import type {
  ChatSummary,
  ChatMessage,
  ChatMessagesPage,
  MessageSendRequest,
  DirectChatRequest,
  GroupChatCreateRequest,
  GroupChatUpdateRequest,
  GroupChatPage,
  UserSearchResult,
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

  searchUsers: (query: string): Promise<UserSearchResult[]> =>
    apiClient
      .get('/users/search', { params: { query, size: 20 } })
      .then((res) => res.data.content ?? []),

  updateGroupChat: (chatId: number, data: GroupChatUpdateRequest): Promise<ChatSummary> =>
    apiClient.patch(`/chats/${chatId}`, data).then((res) => res.data),

  discoverGroups: (page = 0, size = 20): Promise<GroupChatPage> =>
    apiClient.get('/chats/discover', { params: { page, size } }).then((res) => res.data),

  joinGroup: (chatId: number): Promise<ChatSummary> =>
    apiClient.post(`/chats/${chatId}/join`).then((res) => res.data),
}
