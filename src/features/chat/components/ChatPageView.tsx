'use client'

import { Button, SearchField, Separator, Spinner } from '@heroui/react'
import { Bell, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import ChatList from './ChatList'
import ChatConversation from './ChatConversation'
import CreateGroupChatModal from './CreateGroupChatModal'
import DiscoverGroupsModal from './DiscoverGroupsModal'
import useChatStore from '../store/chat.store'

export default function ChatPageView() {
  const { selectedChatId, loadChats, isLoadingChats, chatsError } = useChatStore()
  const isMobileChat = !!selectedChatId
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChats()
  }, [loadChats])

  const syncVisualViewport = useCallback(() => {
    const vv = window.visualViewport
    if (!vv) return
    const el = mobileRef.current
    if (!el) return
    const h = vv.height
    el.style.height = `${h}px`
    if (document.activeElement) {
      const rect = document.activeElement.getBoundingClientRect()
      if (rect.bottom > h) {
        document.activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }
  }, [])

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    vv.addEventListener('resize', syncVisualViewport)
    vv.addEventListener('scroll', syncVisualViewport)
    syncVisualViewport()
    return () => {
      vv.removeEventListener('resize', syncVisualViewport)
      vv.removeEventListener('scroll', syncVisualViewport)
    }
  }, [syncVisualViewport])

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-surface">
      <div
        className={`w-full shrink-0 overflow-hidden border-r border-separator lg:block lg:w-80 ${selectedChatId ? 'hidden' : 'block'
          }`}
      >
        <div className="flex h-full flex-col relative">
          <div className="shrink-0 px-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-(--foreground)">
                Чаты
              </h2>
              <div className="flex gap-1">
                <DiscoverGroupsModal />
                <Button
                  isIconOnly
                  size="sm"
                  variant={searchOpen ? 'secondary' : 'ghost'}
                  onPress={() => {
                    setSearchOpen(!searchOpen)
                    if (searchOpen) setSearchQuery('')
                  }}
                >
                  <Search size={20} />
                </Button>
                <Button isIconOnly size="sm" variant="ghost">
                  <Bell size={20} />
                </Button>
              </div>
            </div>
            {searchOpen && (
              <SearchField
                className="mt-3"
                value={searchQuery}
                onChange={setSearchQuery}
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Поиск..." />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            )}
            <Separator className="mt-3" />
          </div>
          {isLoadingChats ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : chatsError ? (
            <div className="flex flex-1 items-center justify-center px-4">
              <p className="text-sm text-danger">{chatsError}</p>
            </div>
          ) : (
            <ChatList searchQuery={searchQuery} />
          )}
          <div className="absolute bottom-4 right-4">
            <CreateGroupChatModal />
          </div>
        </div>
      </div>

      {isMobileChat && (
        <div
          data-testid="mobile-chat"
          ref={mobileRef}
          className="fixed inset-x-0 top-0 z-[60] flex h-dvh flex-col bg-surface lg:hidden"
        >
          <ChatConversation />
        </div>
      )}

      <div data-testid="desktop-chat" className="hidden flex-1 flex-col overflow-hidden lg:flex">
        {selectedChatId ? (
          <ChatConversation />
        ) : (
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-(--foreground)">
                Выберите чат
              </p>
              <p className="mt-1 text-sm text-muted">
                Выберите чат из списка, чтобы начать общение
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
