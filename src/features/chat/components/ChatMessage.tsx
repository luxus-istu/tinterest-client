'use client'

import { currentUserId } from '../mock/data'
import useChatStore from '../store/chat.store'

export default function ChatMessage() {
  const { chats, selectedChatId } = useChatStore()

  if (!selectedChatId) return null

  const chat = chats.find((c) => c.id === selectedChatId)
  if (!chat) return null

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {chat.isGroup && !isMe && msg.senderAvatar && (
                <img
                  alt={msg.senderName}
                  src={msg.senderAvatar}
                  className="size-6 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="max-w-[75%]">
                {chat.isGroup && !isMe && (
                  <p className="mb-1 ml-1 text-[11px] font-semibold text-(--accent)">
                    {msg.senderName}
                  </p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? 'rounded-br-md bg-(--accent) text-(--accent-foreground)'
                      : 'rounded-bl-md bg-(--surface-secondary) text-(--foreground)'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`mt-0.5 block text-[10px] ${
                      isMe ? 'text-(--accent-foreground)/60' : 'text-(--muted)'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
              {chat.isGroup && isMe && (
                <img
                  alt={msg.senderName}
                  src={msg.senderAvatar}
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
