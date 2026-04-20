"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Theme({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme>
      {children}
    </NextThemesProvider>
  );
}
