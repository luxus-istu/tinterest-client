import Theme from '../providers/Theme'
import { Manrope } from "next/font/google"
import "../styles/globals.css";
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
