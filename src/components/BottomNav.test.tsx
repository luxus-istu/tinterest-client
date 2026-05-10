import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BottomNav from './BottomNav'

vi.mock('next/navigation', () => ({
  usePathname: () => '/search',
}))

describe('BottomNav', () => {
  it('renders all 4 navigation links', () => {
    render(<BottomNav />)
    expect(screen.getByText('Поиск')).toBeInTheDocument()
    expect(screen.getByText('Встречи')).toBeInTheDocument()
    expect(screen.getByText('Чаты')).toBeInTheDocument()
    expect(screen.getByText('Профиль')).toBeInTheDocument()
  })

  it('links point to correct hrefs', () => {
    render(<BottomNav />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
    expect(links[0]).toHaveAttribute('href', '/search')
    expect(links[1]).toHaveAttribute('href', '/meetings')
    expect(links[2]).toHaveAttribute('href', '/chats')
    expect(links[3]).toHaveAttribute('href', '/profile')
  })

  it('highlights active route with active class on icon', () => {
    render(<BottomNav />)
    const links = screen.getAllByRole('link')
    const activeIcon = links[0].querySelector('svg')
    expect(activeIcon).toHaveClass('text-[#FFDD00]')
  })

  it('does not highlight inactive routes', () => {
    render(<BottomNav />)
    const links = screen.getAllByRole('link')
    const inactiveIcon = links[1].querySelector('svg')
    expect(inactiveIcon).toHaveClass('text-muted')
  })
})
