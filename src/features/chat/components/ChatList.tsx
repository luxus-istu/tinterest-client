'use client'

import { Avatar } from '@heroui/react'
import useChatStore from '../store/chat.store'

export default function ChatList() {
  const { chats, selectedChatId, selectChat } = useChatStore()

  const sorted = [...chats].sort(
    (a, b) =>
      new Date(b.lastMessageDate).getTime() -
      new Date(a.lastMessageDate).getTime(),
  )

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {sorted.map((chat) => {
        const isActive = selectedChatId === chat.id
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
              {chat.isGroup ? (
                <div className="grid size-10 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-full">
                  {chat.members?.slice(0, 4).map((m) => (
                    <img
                      key={m.id}
                      alt={m.name}
                      src={m.avatar}
                      className="size-full object-cover"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <Avatar size="md">
                    <Avatar.Image alt={chat.user.name} src={chat.user.avatar} />
                    <Avatar.Fallback>
                      {chat.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar.Fallback>
                  </Avatar>
                  {chat.user.isOnline && (
                    <span className="absolute right-0 bottom-0 size-3 rounded-full bg-(--success) ring-2 ring-(--background)" />
                  )}
                </>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-(--foreground)">
                  {chat.user.name}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 flex size-5 shrink-0 items-center justify-center self-center rounded-full bg-(--accent) text-[10px] font-bold text-(--accent-foreground)">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-(--muted)">
                {chat.isGroup && chat.lastSender
                  ? `${chat.lastSender}: ${chat.lastMessage}`
                  : chat.lastMessage}
              </p>
              {chat.isGroup && (
                <p className="mt-0.5 text-[10px] text-(--accent)">
                  {chat.onlineCount} в сети, {chat.memberCount} участников
                </p>
              )}
            </div>
            <span className="self-center shrink-0 text-[11px] text-(--muted)">
              {chat.lastMessageTime}
            </span>
          </button>
        )
      })}
    </div>
  )
}
