import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LoadingView from './LoadingView'

describe('LoadingView', () => {
  it('renders a spinner element', () => {
    const { container } = render(<LoadingView />)
    const spinner = container.querySelector('[data-slot="spinner"]')
    expect(spinner).toBeInTheDocument()
  })

  it('renders centered in min-h-screen container', () => {
    const { container } = render(<LoadingView />)
    const wrapper = container.querySelector('[data-slot="spinner"]')?.parentElement
    expect(wrapper).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center')
  })

  it('renders spinner with lg size', () => {
    const { container } = render(<LoadingView />)
    const spinner = container.querySelector('[data-slot="spinner"]')
    expect(spinner).toHaveClass('spinner--lg')
  })
})
