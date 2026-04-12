'use client'

import { Provider } from 'react-redux'
import { store } from './store'

/**
 * A client component that provides the Redux store to the application.
 * It ensures that each request has its own store instance.
 */
export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Provider store={store}>{children}</Provider>
}
