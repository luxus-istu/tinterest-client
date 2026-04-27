import Theme from '../providers/Theme'
import { Manrope } from "next/font/google"
import "../styles/globals.css";
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next';

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
        <Analytics />
      </body>
    </html>
  )
}
