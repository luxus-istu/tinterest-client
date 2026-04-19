import Theme from '../providers/Theme'
import './globals.css'
import { Manrope } from 'next/font/google'
import type { ReactNode } from 'react'

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}
