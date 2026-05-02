'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, MapPin, MessageCircle, User } from 'lucide-react'

const navItems = [
  {
    href: '/search',
    label: 'Поиск',
    icon: MapPin,
  },
  {
    href: '/matching',
    label: 'Встречи',
    icon: LayoutGrid,
  },
  {
    href: '/chats',
    label: 'Чаты',
    icon: MessageCircle,
  },
  {
    href: '/profile',
    label: 'Профиль',
    icon: User,
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="border-separator fixed right-0 bottom-0 left-0 z-50 border-t bg-(--background)/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors"
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-[#FFDD00]' : 'text-muted'}
              />
              <span
                className={`text-[10px] leading-none font-medium ${isActive ? 'text-[#FFDD00]' : 'text-muted'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
