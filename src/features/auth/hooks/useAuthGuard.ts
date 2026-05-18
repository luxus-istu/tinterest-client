'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import useAuthStore from '../store/auth.store'
import type { AuthRole } from '../utils/jwt'

interface UseAuthGuardOptions {
  requireAuth?: boolean
  requireProfile?: boolean
  requireRole?: 'ADMIN' | 'MODERATOR' | 'USER'
  redirectTo?: string
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAuth = true, requireProfile = true, requireRole, redirectTo } = options
  const resolvedRedirect = redirectTo ?? (requireAuth ? '/login' : '/')
  const { isAuthenticated, isLoading } = useAuth()
  const role = useAuthStore((s) => s.role)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const effectiveRole = role ?? (user as { role?: AuthRole } | undefined)?.role

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

    if (requireRole && effectiveRole !== requireRole) {
      router.replace(resolvedRedirect)
      return
    }

    if (requireAuth && isAuthenticated && requireProfile && user && !user.hasFilledProfile) {
      router.replace('/onboarding')
    }
  }, [effectiveRole, isAuthenticated, isLoading, requireAuth, requireProfile, requireRole, resolvedRedirect, router, user])

  return { isLoading }
}
