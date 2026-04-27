"use client"

import { Button } from '@heroui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background blurred elements */}
      <div className="absolute top-[10%] right-[-10%] h-52.5 w-52.5 rounded-full bg-[#FFDD00] opacity-70 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-20%] h-150 w-100 rounded-full bg-[#FFDD00] opacity-70 blur-[120px]" />

      <div className="z-10 flex w-full max-w-100.5 flex-col items-center px-4 py-8">
        {/* Logo and App Name */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <img src={'/T-bank-logo.svg'} alt="logo" className="h-[52px] w-[52px]" />
          <h1 className="text-5xl font-black leading-none tracking-tight">Tinterest</h1>
        </div>

        {/* Subtitle */}
        <h2 className="mb-24 text-center text-2xl font-extrabold leading-tight">
          Новые знакомства на рабочем месте!
        </h2>

        {/* Actions */}
        <div className="flex w-full flex-col items-center gap-6 font-semibold">
          <Button
            className="h-15 w-full max-w-81.5 text-lg"
            onPress={() => router.push('/register')}
          >
            Зарегистрироваться
          </Button>

          <div className="flex flex-col items-center gap-1 text-lg">
            <span className="text-[#c0c0c7] font-normal">Уже есть анкета?</span>
            <Link href="/login" className="font-semibold">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
