import { Button } from '@heroui/react'

interface StepActionsProps {
  isSaving: boolean
  onBack?: () => void
  submitLabel?: string
}

export function StepActions({ isSaving, onBack, submitLabel = 'Продолжить' }: StepActionsProps) {
  return (
    <div className="sticky bottom-0 mt-6 flex flex-col-reverse gap-2 border-t border-border bg-surface pt-4 sm:static sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:border-t-0 sm:bg-transparent sm:pt-0">
      {onBack ? (
        <Button
          type="button"
          variant="secondary"
          onPress={onBack}
          isDisabled={isSaving}
          className="w-full sm:w-auto"
        >
          Назад
        </Button>
      ) : (
        <span className="hidden sm:block" />
      )}
      <Button type="submit" isDisabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? 'Сохранение...' : submitLabel}
      </Button>
    </div>
  )
}
