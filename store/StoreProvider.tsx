'use client'

import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store'

/**
 * A client component that provides the Redux store to the application.
 * It ensures that each request has its own store instance.
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [store] = useState(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}
