'use client'

import type { ReactNode } from 'react'
import BottomNav from '@/src/components/BottomNav'
import ProtectedRoute from '@/src/features/auth/components/ProtectedRoute'

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
