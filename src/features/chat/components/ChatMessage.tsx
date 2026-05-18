'use client'

import { useEffect, useRef } from 'react'
import { Spinner } from '@heroui/react'
import useChatStore from '../store/chat.store'
import useAuthStore from '@/src/features/auth/store/auth.store'
import type { ChatMember } from '../types'

function fullName(member: ChatMember) {
  return `${member.firstName} ${member.lastName}`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatMessage() {
  const {
    messages,
    selectedChatId,
    chats,
    hasMore,
    isLoadingMessages,
    loadMoreMessages,
  } = useChatStore()
  const me = useAuthStore((s) => s.user)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedChatId) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore[selectedChatId] && !isLoadingMessages) {
          loadMoreMessages(selectedChatId)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [selectedChatId, hasMore, isLoadingMessages, loadMoreMessages])

  if (!selectedChatId) return null

  const chat = chats.find((c) => c.id === selectedChatId)
  if (!chat) return null

  const chatMessages = messages[selectedChatId] ?? []
  const isGroup = chat.type === 'GROUP'
  const canLoadMore = hasMore[selectedChatId] ?? false

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {canLoadMore && (
          <div ref={sentinelRef} className="flex justify-center py-2">
            {isLoadingMessages && <Spinner size="sm" />}
          </div>
        )}
        {chatMessages.map((msg) => {
          const isMe = msg.senderId === me?.id
          const sender = chat.members.find((m) => m.userId === msg.senderId)
          const senderName = sender ? fullName(sender) : 'Неизвестный'
          const senderAvatar = sender?.avatarUrl

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {isGroup && !isMe && senderAvatar && (
                <img
                  alt={senderName}
                  src={senderAvatar}
                  className="size-6 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="max-w-[75%]">
                {isGroup && !isMe && (
                  <p className="mb-1 ml-1 text-[11px] font-semibold text-accent">
                    {senderName}
                  </p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${isMe
                    ? 'rounded-br-md bg-accent text-accent-foreground'
                    : 'rounded-bl-md bg-surface-secondary text-(--foreground)'
                    }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`mt-0.5 block text-[10px] ${isMe ? 'text-(--accent-foreground)/60' : 'text-muted'
                      }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
              {isGroup && isMe && senderAvatar && (
                <img
                  alt={senderName}
                  src={senderAvatar}
                  className="size-6 shrink-0 rounded-full object-cover"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
