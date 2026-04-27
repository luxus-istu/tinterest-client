import QueryProvider from '../providers/QueryProvider'
import { Manrope } from "next/font/google"
import "../styles/globals.css";
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next';
import ThemeProvider from '../providers/ThemeProvider';

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
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
