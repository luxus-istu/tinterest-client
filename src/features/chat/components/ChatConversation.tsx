'use client'

import { Button, Surface } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import GroupEditModal from './GroupEditModal'
import useChatStore from '../store/chat.store'
import useAuthStore from '@/src/features/auth/store/auth.store'
import type { ChatSummary, ChatMember } from '../types'

function getOtherMember(chat: ChatSummary): ChatMember | undefined {
  const me = useAuthStore.getState().user
  return chat.members.find((m) => m.userId !== me?.id)
}

function fullName(member: ChatMember) {
  return `${member.firstName} ${member.lastName}`
}

function isCurrentUserGroupOwner(chat: ChatSummary, userId?: number) {
  return (
    chat.type === 'GROUP' &&
    chat.members.some((member) => member.userId === userId && member.role === 'OWNER')
  )
}

export default function ChatConversation() {
  const { chats, selectedChatId, goBack } = useChatStore()
  const user = useAuthStore((state) => state.user)

  if (!selectedChatId) return null

  const chat = chats.find((c) => c.id === selectedChatId)
  if (!chat) return null

  const isGroup = chat.type === 'GROUP'
  const isOwner = isCurrentUserGroupOwner(chat, user?.id)
  const other = getOtherMember(chat)
  const displayTitle = isGroup ? chat.title : other ? fullName(other) : chat.title
  const avatarUrl = isGroup ? undefined : other?.avatarUrl

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Surface
        variant="default"
        className="border-separator flex shrink-0 items-center gap-3 border-b px-4 py-3"
      >
        <Button data-testid="back-btn" isIconOnly size="sm" variant="ghost" className="lg:hidden" onPress={goBack}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isGroup ? (
            <div className="bg-accent text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {displayTitle.charAt(0)}
            </div>
          ) : avatarUrl ? (
            <img
              alt={displayTitle}
              src={avatarUrl}
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <div className="bg-accent text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {displayTitle.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-(--foreground)">{displayTitle}</p>
            <p className="text-muted text-xs">
              {isGroup ? `${chat.members.length} участников` : ''}
            </p>
          </div>
        </div>
        {isOwner && (
          <div className="shrink-0">
            <GroupEditModal chat={chat} />
          </div>
        )}
      </Surface>
      <ChatMessage />
      <ChatInput />
    </div>
  )
}
