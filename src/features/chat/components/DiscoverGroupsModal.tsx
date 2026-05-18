'use client'

import {
  Avatar,
  Button,
  Modal,
  Spinner,
} from '@heroui/react'
import { Compass, Users } from 'lucide-react'
import { useCallback, useState } from 'react'
import useChatStore from '../store/chat.store'
import type { ChatSummary } from '../types'

export default function DiscoverGroupsModal() {
  const { discoverGroups, joinGroup } = useChatStore()
  const [isOpen, setIsOpen] = useState(false)
  const [groups, setGroups] = useState<ChatSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [joiningId, setJoiningId] = useState<number | null>(null)

  const loadGroups = useCallback(async () => {
    setIsLoading(true)
    try {
      const page = await discoverGroups()
      setGroups(page.content)
    } finally {
      setIsLoading(false)
    }
  }, [discoverGroups])

  const handleOpen = (open: boolean) => {
    setIsOpen(open)
    if (open) loadGroups()
  }

  const handleJoin = async (chatId: number) => {
    setJoiningId(chatId)
    try {
      const chat = await joinGroup(chatId)
      setGroups((prev) => prev.filter((g) => g.id !== chatId))
      useChatStore.getState().selectChat(chat.id)
      setIsOpen(false)
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <>
      <Button size="sm" variant="ghost" onPress={() => handleOpen(true)}>
        <Compass size={18} className="mr-1.5" />
        Обзор
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                <div className="flex items-center gap-2">
                  <Compass size={20} />
                  Публичные группы
                </div>
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : groups.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">
                  Нет доступных публичных групп
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 rounded-lg border border-separator p-3"
                    >
                      <Avatar size="sm">
                        <Avatar.Fallback>
                          {group.title.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-(--foreground)">
                          {group.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted">
                          <Users size={12} />
                          {group.members.length}{' '}
                          {group.members.length === 1 ? 'участник' : 'участников'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        isDisabled={joiningId === group.id}
                        onPress={() => handleJoin(group.id)}
                      >
                        {joiningId === group.id ? <Spinner size="sm" /> : 'Вступить'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}
