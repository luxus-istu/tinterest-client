'use client'

import { Form, Label, TextField } from '@heroui/react'
import { useEffect, useState, type ChangeEvent } from 'react'
import { StepActions } from '@/src/features/onboarding/components/steps/StepActions'

interface AvatarStepProps {
  defaultFile: File | null
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (file: File | null) => Promise<void>
}

export function AvatarStep({
  defaultFile,
  isSaving,
  errorMessage,
  onBack,
  onSubmit,
}: AvatarStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(defaultFile)
  const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
    defaultFile ? URL.createObjectURL(defaultFile) : null
  )

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null

    setSelectedFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const onValidSubmit = async () => {
    await onSubmit(selectedFile)
  }

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    },
    [previewUrl]
  )

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        void onValidSubmit()
      }}
      className="space-y-4"
    >
      <p className="text-sm text-muted">
        Загрузите аватар. Этот шаг можно пропустить и вернуться к нему позже.
      </p>

      {previewUrl ? (
        <div
          className="mx-auto h-32 w-32 overflow-hidden rounded-full border border-border bg-surface-secondary bg-center bg-cover shadow-sm"
          style={{ backgroundImage: `url(${previewUrl})` }}
          role="img"
          aria-label="Превью выбранного фото"
        />
      ) : (
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-border bg-surface-secondary text-center text-xs text-muted">
          Превью
        </div>
      )}

      <TextField>
        <Label>Фото профиля</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full rounded-xl border border-border bg-field-background px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface-secondary file:px-3 file:py-2 file:text-sm"
        />
      </TextField>

      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
