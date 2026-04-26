"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from 'react';

export default function Theme({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme>
      {children}
    </NextThemesProvider>
  );
}
