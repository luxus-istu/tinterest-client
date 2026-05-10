'use client'

import type { ReactNode } from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { Spinner } from '@heroui/react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoading } = useAuthGuard({ requireAuth: true })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {fallback ?? <Spinner size="lg" />}
      </div>
    )
  }

  return <>{children}</>
}
