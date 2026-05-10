'use client'

import { Button, Card } from '@heroui/react'
import { useRouter } from 'next/navigation'

export default function ErrorView({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-2">
      <Card className="w-full max-w-lg shadow-xl">
        <Card.Header className="flex flex-col items-center gap-1 pb-2 text-center">
          <Card.Title className="text-2xl font-black">Что-то пошло не так</Card.Title>
          <Card.Description className="text-center font-medium">
            Произошла ошибка при загрузке страницы. Попробуйте снова.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col items-center gap-4 py-6">
          <Button
            className="w-full max-w-xs"
            onPress={() => reset()}
          >
            Попробовать снова
          </Button>
          <Button
            className="w-full max-w-xs"
            variant="outline"
            onPress={() => router.push('/')}
          >
            На главную
          </Button>
        </Card.Content>
      </Card>
    </div>
  )
}
