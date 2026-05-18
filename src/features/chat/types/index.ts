export type ChatType = 'DIRECT' | 'GROUP'
export type ChatRole = 'OWNER' | 'MEMBER'
export type MessageType = 'TEXT'

export interface ChatMember {
  userId: number
  firstName: string
  lastName: string
  avatarUrl: string
  role: ChatRole
  joinedAt: string
  lastReadAt: string
}

export interface ChatMessage {
  id: string
  chatId: number
  senderId: number
  type: MessageType
  content: string
  createdAt: string
}

export interface ChatSummary {
  id: number
  type: ChatType
  title: string
  isPublic: boolean
  createdBy: number
  createdAt: string
  members: ChatMember[]
  lastMessage: ChatMessage | null
  unreadCount: number
}

export interface ChatMessagesPage {
  content: ChatMessage[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface MessageSendRequest {
  type: MessageType
  content: string
}

export interface DirectChatRequest {
  userId: number
}

export interface GroupChatCreateRequest {
  title: string
  isPublic: boolean
  memberIds: number[]
}

export interface UserSearchResult {
  id: number
  firstName: string
  lastName: string
  avatarUrl: string
}

export interface GroupChatUpdateRequest {
  title?: string
  isPublic?: boolean
}

export interface GroupChatPage {
  content: ChatSummary[]
  totalPages: number
  totalElements: number
}
