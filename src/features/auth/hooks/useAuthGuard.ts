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
  const { isAuthenticated, isInitialized, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) return

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo)
    } else if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, isInitialized, requireAuth, redirectTo, router])

  return { isLoading: isLoading || !isInitialized, isAuthenticated }
}
