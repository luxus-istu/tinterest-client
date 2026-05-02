'use client'

import { Button, Separator } from '@heroui/react'
import { Bell, Search } from 'lucide-react'
import ChatList from './ChatList'
import ChatConversation from './ChatConversation'
import useChatStore from '../store/chat.store'

export default function ChatPageView() {
  const { selectedChatId } = useChatStore()
  const isMobileChat = !!selectedChatId

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl overflow-hidden bg-(--surface)">
      <div
        className={`w-full shrink-0 overflow-hidden border-r border-(--separator) lg:block lg:w-80 ${
          selectedChatId ? 'hidden' : 'block'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="shrink-0 px-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-(--foreground)">
                Чаты
              </h2>
              <div className="flex gap-1">
                <Button isIconOnly size="sm" variant="ghost">
                  <Search size={20} />
                </Button>
                <Button isIconOnly size="sm" variant="ghost">
                  <Bell size={20} />
                </Button>
              </div>
            </div>
            <Separator className="mt-3" />
          </div>
          <ChatList />
        </div>
      </div>

      {isMobileChat && (
        <div className="fixed inset-0 z-[51] flex flex-col bg-(--surface) lg:hidden">
          <ChatConversation />
        </div>
      )}

      <div className="hidden flex-1 flex-col overflow-hidden lg:flex">
        {selectedChatId ? (
          <ChatConversation />
        ) : (
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-(--foreground)">
                Выберите чат
              </p>
              <p className="mt-1 text-sm text-(--muted)">
                У вас пока нет активных диалогов
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
