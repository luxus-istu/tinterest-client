import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AppLayout from './layout'

vi.mock('@/src/features/auth/components/ProtectedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>,
}))

vi.mock('@/src/components/BottomNav', () => ({
  default: () => <nav data-testid="bottom-nav">BottomNav</nav>,
}))

describe('AppLayout', () => {
  it('renders children inside ProtectedRoute and Suspense', () => {
    render(
      <AppLayout>
        <div data-testid="page-content">Page content</div>
      </AppLayout>,
    )
    expect(screen.getByTestId('protected-route')).toBeInTheDocument()
    expect(screen.getByTestId('page-content')).toBeInTheDocument()
  })

  it('renders BottomNav', () => {
    render(
      <AppLayout>
        <div>content</div>
      </AppLayout>,
    )
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument()
  })
})
