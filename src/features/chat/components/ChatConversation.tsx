'use client'

import { Button, Surface } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import useChatStore from '../store/chat.store'

export default function ChatConversation() {
  const { chats, selectedChatId, goBack } = useChatStore()

  if (!selectedChatId) return null

  const chat = chats.find((c) => c.id === selectedChatId)
  if (!chat) return null

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
          {chat.isGroup ? (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-sm font-bold text-(--accent-foreground)">
              {chat.user.name.charAt(0)}
            </div>
          ) : (
            <div className="relative">
              <img
                alt={chat.user.name}
                src={chat.user.avatar}
                className="size-9 rounded-full object-cover"
              />
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-(--success) ring-2 ring-(--background)" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-(--foreground)">
              {chat.user.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-(--muted)">
              {chat.isGroup ? (
                `${chat.onlineCount} в сети, ${chat.memberCount} участников`
              ) : chat.user.isOnline ? (
                <>
                  <span className="size-1.5 rounded-full bg-(--success)" />
                  В сети
                </>
              ) : (
                'Не в сети'
              )}
            </p>
          </div>
        </div>
      </Surface>
      <ChatMessage />
      <ChatInput />
    </div>
  )
}
