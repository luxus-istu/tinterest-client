'use client'

import { Button, Surface } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
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

export default function ChatConversation() {
  const { chats, selectedChatId, goBack } = useChatStore()

  if (!selectedChatId) return null

  const chat = chats.find((c) => c.id === selectedChatId)
  if (!chat) return null

  const isGroup = chat.type === 'GROUP'
  const other = getOtherMember(chat)
  const displayTitle = isGroup ? chat.title : (other ? fullName(other) : chat.title)
  const avatarUrl = isGroup ? undefined : other?.avatarUrl

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Surface
        variant="default"
        className="border-separator flex shrink-0 items-center gap-3 border-b px-4 py-3"
      >
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          className="lg:hidden"
          onPress={goBack}
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-3">
          {isGroup ? (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-sm font-bold text-(--accent-foreground)">
              {displayTitle.charAt(0)}
            </div>
          ) : (
            <img
              alt={displayTitle}
              src={avatarUrl ?? ''}
              className="size-9 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-(--foreground)">
              {displayTitle}
            </p>
            <p className="text-xs text-(--muted)">
              {isGroup ? `${chat.members.length} участников` : ''}
            </p>
          </div>
        </div>
      </Surface>
      <ChatMessage />
      <ChatInput />
    </div>
  )
}
