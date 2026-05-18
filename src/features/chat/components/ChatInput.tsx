'use client'

import { Button } from '@heroui/react'
import { Send } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import useChatStore from '../store/chat.store'

export default function ChatInput() {
  const { sendMessage, selectedChatId } = useChatStore()
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = useCallback(() => {
    if (!text.trim()) return
    sendMessage(text)
    setText('')
    inputRef.current?.focus()
  }, [text, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  if (!selectedChatId) return null

  return (
    <div className="border-separator flex shrink-0 items-center gap-2 border-t bg-surface px-4 py-3">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение..."
        className="w-full rounded-xl border-0 bg-surface-secondary px-4 py-2.5 text-sm text-(--foreground) outline-none placeholder:text-muted"
      />
      <Button
        isIconOnly
        size="sm"
        className="shrink-0"
        onPress={handleSend}
        isDisabled={!text.trim()}
      >
        <Send size={18} />
      </Button>
    </div>
  )
}
