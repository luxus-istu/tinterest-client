import { Spinner } from '@heroui/react'

export default function LoadingView() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
