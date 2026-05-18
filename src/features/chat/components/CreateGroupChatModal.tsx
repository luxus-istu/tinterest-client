'use client'

import {
  Avatar,
  Button,
  Input,
  Label,
  Modal,
  Spinner,
  Switch,
  TextField,
} from '@heroui/react'
import { X, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { chatApi } from '../api/chat.api'
import useChatStore from '../store/chat.store'
import type { UserSearchResult } from '../types'

export default function CreateGroupChatModal() {
  const { createGroupChat } = useChatStore()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [selected, setSelected] = useState<UserSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const searchUsers = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setIsSearching(true)
    try {
      const users = await chatApi.searchUsers(q)
      setResults(users)
    } catch {
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchUsers(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, searchUsers])

  const toggleUser = (user: UserSearchResult) => {
    setSelected((prev) => {
      const exists = prev.some((u) => u.id === user.id)
      if (exists) return prev.filter((u) => u.id !== user.id)
      return [...prev, user]
    })
  }

  const removeUser = (userId: number) => {
    setSelected((prev) => prev.filter((u) => u.id !== userId))
  }

  const filteredResults = results.filter(
    (r) => !selected.some((s) => s.id === r.id)
  )

  const handleCreate = useCallback(async () => {
    if (!title.trim() || selected.length === 0) return
    setIsCreating(true)
    setError(null)
    try {
      const chat = await createGroupChat(
        title.trim(),
        isPublic,
        selected.map((u) => u.id)
      )
      useChatStore.getState().selectChat(chat.id)
      setIsOpen(false)
    } catch {
      setError('Не удалось создать групповой чат')
    } finally {
      setIsCreating(false)
    }
  }, [title, selected, isPublic, createGroupChat])

  const handleOpen = () => {
    setTitle('')
    setQuery('')
    setResults([])
    setSelected([])
    setError(null)
    setIsPublic(true)
    setIsOpen(true)
  }

  const isFormValid = title.trim().length > 0 && selected.length > 0

  return (
    <>
      <Button
        isIconOnly
        size="lg"
        className="size-12 rounded-full shadow-lg"
        onPress={handleOpen}
      >
        <Plus size={24} />
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            {(renderProps) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Создать групповой чат</Modal.Heading>
                  <p className="text-sm text-muted">
                    Выберите участников и задайте название
                  </p>
                </Modal.Header>
                <Modal.Body>
                  <div className="flex flex-col gap-4">
                    <TextField
                      className="w-full"
                      name="title"
                      isRequired
                      value={title}
                      onChange={setTitle}
                    >
                      <Label>Название чата</Label>
                      <Input placeholder="Введите название" />
                    </TextField>

                    <Switch isSelected={isPublic} onChange={setIsPublic}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Content>
                        <Label>Публичная группа</Label>
                      </Switch.Content>
                    </Switch>

                    <div className="flex flex-col gap-2">
                      {selected.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selected.map((user) => (
                            <span
                              key={user.id}
                              className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent-soft-foreground"
                            >
                              {user.firstName} {user.lastName}
                              <button
                                type="button"
                                onClick={() => removeUser(user.id)}
                                className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <TextField
                        className="w-full"
                        name="search"
                        value={query}
                        onChange={setQuery}
                      >
                        <Label>Поиск пользователей</Label>
                        <Input placeholder="Поиск по имени..." />
                      </TextField>

                      {isSearching && (
                        <div className="flex justify-center py-2">
                          <Spinner size="sm" />
                        </div>
                      )}

                      {!isSearching && filteredResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto rounded-xl border border-separator">
                          {filteredResults.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => toggleUser(user)}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface-secondary"
                            >
                              <Avatar size="sm">
                                {user.avatarUrl && (
                                  <Avatar.Image
                                    alt={`${user.firstName} ${user.lastName}`}
                                    src={user.avatarUrl}
                                  />
                                )}
                                <Avatar.Fallback>
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </Avatar.Fallback>
                              </Avatar>
                              <span className="text-sm">
                                {user.firstName} {user.lastName}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {!isSearching &&
                        query.trim() &&
                        filteredResults.length === 0 && (
                          <p className="py-2 text-center text-xs text-muted">
                            Пользователи не найдены
                          </p>
                        )}
                    </div>

                    {error && (
                      <p className="text-sm text-danger">{error}</p>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onPress={() => renderProps.close()}
                  >
                    Отмена
                  </Button>
                  <Button
                    isDisabled={!isFormValid}
                    isPending={isCreating}
                    onPress={handleCreate}
                  >
                    Создать
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}
