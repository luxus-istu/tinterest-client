'use client'

import { AdminView } from '@/src/features/admin/components/AdminView'
import { useAuthGuard } from '@/src/features/auth/hooks/useAuthGuard'
import LoadingView from '@/src/components/LoadingView'

export default function AdminPage() {
  const { isLoading } = useAuthGuard({ requireAuth: true, requireRole: 'ADMIN', redirectTo: '/matching' })

  if (isLoading) return <LoadingView />

  return <AdminView />
}
