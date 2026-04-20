import Theme from '../providers/Theme'
import QueryProvider from '../providers/QueryProvider'
import { Manrope } from "next/font/google"
import "../styles/globals.css"

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={manrope.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <QueryProvider>
          <Theme>
            {children}
          </Theme>
        </QueryProvider>
      </body>
    </html>
  )
}
