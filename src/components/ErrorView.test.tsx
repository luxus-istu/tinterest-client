import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ErrorView from './ErrorView'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('ErrorView', () => {
  const error = new Error('Test error') as Error & { digest?: string }
  error.digest = 'abc123'

  it('renders error title and description', () => {
    render(<ErrorView error={error} reset={vi.fn()} />)
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument()
    expect(
      screen.getByText('Произошла ошибка при загрузке страницы. Попробуйте снова.'),
    ).toBeInTheDocument()
  })

  it('renders reset button and calls reset on press', async () => {
    const resetMock = vi.fn()
    render(<ErrorView error={error} reset={resetMock} />)

    await userEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }))
    expect(resetMock).toHaveBeenCalledTimes(1)
  })

  it('renders home button and navigates to / on press', async () => {
    pushMock.mockReset()
    render(<ErrorView error={error} reset={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'На главную' }))
    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
