import "../styles/globals.css";
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import QueryProvider from '../providers/QueryProvider'
import ThemeProvider from '../providers/ThemeProvider';
import { Toaster } from 'sonner';


const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
})

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: {
    default: 'Tinterest — Знакомства в Т-Банке',
    template: '%s | Tinterest',
  },
  description:
    'Новые знакомства на рабочем месте! Tinterest помогает сотрудникам Т-Банка найти общий язык, дружить и строить отношения.',
  keywords: [
    'Tinterest',
    'Тинтерест',
    'знакомства',
    'Т-Банк',
    'T-Bank',
    'сотрудники',
    'работа',
    'коллеги',
    'dating',
  ],
  authors: [{ name: 'LUXUS' }],
  creator: 'LUXUS',
  metadataBase: new URL('https://tinterest.online'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Tinterest',
    title: 'Tinterest — Знакомства в Т-Банке',
    description:
      'Новые знакомства на рабочем месте! Tinterest помогает сотрудникам Т-Банка найти общий язык, дружить и строить отношения.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Tinterest Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tinterest — Знакомства в Т-Банке',
    description:
      'Новые знакомства на рабочем месте! Tinterest помогает сотрудникам Т-Банка найти общий язык, дружить и строить отношения.',
    images: ['/icon-512.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tinterest',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/T-bank-logo.svg',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#FFDD00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

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
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
