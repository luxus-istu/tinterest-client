'use client'

import { Button, Input, Label, Modal, Spinner, Switch, TextField } from '@heroui/react'
import { Pencil } from 'lucide-react'
import { useCallback, useState } from 'react'
import useChatStore from '../store/chat.store'
import type { ChatSummary } from '../types'

interface GroupEditModalProps {
  chat: ChatSummary
}

export default function GroupEditModal({ chat }: GroupEditModalProps) {
  const { updateGroupChat } = useChatStore()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(chat.title)
  const [isPublic, setIsPublic] = useState(chat.isPublic)
  const [isSaving, setIsSaving] = useState(false)

  const handleOpen = () => {
    setTitle(chat.title)
    setIsPublic(chat.isPublic)
    setIsOpen(true)
  }

  const handleSave = useCallback(
    async (close: () => void) => {
      if (!title.trim()) return
      setIsSaving(true)
      try {
        await updateGroupChat(chat.id, { title: title.trim(), isPublic })
        close()
      } finally {
        setIsSaving(false)
      }
    },
    [chat.id, title, isPublic, updateGroupChat]
  )

  return (
    <>
      <Button isIconOnly size="sm" variant="ghost" onPress={handleOpen}>
        <Pencil size={16} />
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-sm">
            {(renderProps) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Редактировать группу</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <div className="flex flex-col gap-4">
                    <TextField className="w-full" name="title" isRequired onChange={setTitle}>
                      <Label>Название</Label>
                      <Input value={title} placeholder="Введите название" />
                    </TextField>

                    <Switch isSelected={isPublic} onChange={setIsPublic}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Content>
                        <Label>Публичная группа</Label>
                      </Switch.Content>
                    </Switch>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button slot="close" variant="tertiary" isDisabled={isSaving}>
                    Отмена
                  </Button>
                  <Button
                    isDisabled={!title.trim()}
                    isPending={isSaving}
                    onPress={() => handleSave(renderProps.close)}
                  >
                    {({ isPending }) => (
                      <>
                        {isPending ? <Spinner color="current" size="sm" /> : null}
                        Сохранить
                      </>
                    )}
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
