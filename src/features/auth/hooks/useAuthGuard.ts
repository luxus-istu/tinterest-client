'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

interface UseAuthGuardOptions {
  requireAuth?: boolean
  redirectTo?: string
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAuth = true, redirectTo = requireAuth ? '/login' : '/' } = options
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo)
    } else if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, requireAuth, redirectTo, router])

  return { isLoading: isLoading || isAuthenticated }
}
