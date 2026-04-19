'use client'
import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

export default function Theme({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme>
      {children}
    </ThemeProvider>
  )
}
