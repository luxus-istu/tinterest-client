'use client'

import { Avatar } from '@heroui/react'
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

export default function ChatList() {
  const { chats, selectedChatId, selectChat } = useChatStore()

  const sorted = [...chats].sort(
    (a, b) =>
      new Date(b.lastMessage?.createdAt ?? b.createdAt).getTime() -
      new Date(a.lastMessage?.createdAt ?? a.createdAt).getTime(),
  )

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {sorted.map((chat) => {
        const isActive = selectedChatId === chat.id
        const isGroup = chat.type === 'GROUP'
        const other = getOtherMember(chat)
        const displayTitle = isGroup ? chat.title : (other ? fullName(other) : chat.title)
        const avatarUrl = isGroup ? undefined : other?.avatarUrl

        return (
          <button
            key={chat.id}
            type="button"
            onClick={() => selectChat(chat.id)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-(--surface-secondary) ${
              isActive ? 'bg-(--surface-secondary)' : ''
            }`}
          >
            <div className="relative shrink-0">
              {isGroup ? (
                <div className="grid size-10 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-full">
                  {chat.members?.slice(0, 4).map((m) => (
                    <img
                      key={m.userId}
                      alt={fullName(m)}
                      src={m.avatarUrl}
                      className="size-full object-cover"
                    />
                  ))}
                </div>
              ) : (
                <Avatar size="md">
                  <Avatar.Image alt={displayTitle} src={avatarUrl ?? ''} />
                  <Avatar.Fallback>
                    {displayTitle
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Avatar.Fallback>
                </Avatar>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-(--foreground)">
                  {displayTitle}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 flex size-5 shrink-0 items-center justify-center self-center rounded-full bg-(--accent) text-[10px] font-bold text-(--accent-foreground)">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-(--muted)">
                {chat.lastMessage?.content ?? 'Нет сообщений'}
              </p>
              {isGroup && (
                <p className="mt-0.5 text-[10px] text-(--accent)">
                  {chat.members.length} участников
                </p>
              )}
            </div>
            {chat.lastMessage && (
              <span className="self-center shrink-0 text-[11px] text-(--muted)">
                {formatTime(chat.lastMessage.createdAt)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
