'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import useAuthStore from '../store/auth.store'

interface UseAuthGuardOptions {
  requireAuth?: boolean
  requireProfile?: boolean
  redirectTo?: string
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAuth = true, requireProfile = true, redirectTo } = options
  const resolvedRedirect = redirectTo ?? (requireAuth ? '/login' : '/')
  const { isAuthenticated, isLoading } = useAuth()
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      router.replace(resolvedRedirect)
      return
    }

    if (!requireAuth && isAuthenticated) {
      router.replace(resolvedRedirect)
      return
    }

    if (requireAuth && isAuthenticated && requireProfile && user && !user.hasFilledProfile) {
      router.replace('/onboarding')
    }
  }, [isAuthenticated, isLoading, requireAuth, requireProfile, resolvedRedirect, router, user])

  return { isLoading }
}
