'use client'

import { Button, Card } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface VerifiedConfirmationProps {
  message?: string | null
}

export default function VerifiedConfirmation({ message }: VerifiedConfirmationProps) {
  const router = useRouter()

  const handleNavigate = useCallback(() => {
    router.push('/login')
  }, [router])

  return (
    <Card.Content className="flex flex-col items-center gap-4 py-6 text-center">
      {message && (
        <p className="text-lg font-bold text-success">{message}</p>
      )}
      <Button className="w-full max-w-xs" variant="primary" onPress={handleNavigate}>
        Перейти ко входу
      </Button>
    </Card.Content>
  )
}
