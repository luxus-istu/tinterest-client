'use client'

import { AdminView } from '@/src/features/admin/components/AdminView'
import { useAuthGuard } from '@/src/features/auth/hooks/useAuthGuard'

export default function AdminPage() {
  useAuthGuard({ requireAuth: true, requireRole: 'ADMIN', redirectTo: '/matching' })

  return <AdminView />
}
