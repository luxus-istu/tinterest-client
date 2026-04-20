import Theme from '../providers/Theme'
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
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}
