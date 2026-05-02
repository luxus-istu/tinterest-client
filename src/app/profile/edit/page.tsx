'use client'

import { useRouter } from 'next/navigation'
import { useProfile } from '@/src/features/profile/hooks/useProfile'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, displayUser, isLoading } = useProfile()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-white">Загрузка...</div>
      </main>
    )
  }

  if (!user || !displayUser) return null

  return (
    <div className="bg-background min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-4xl bg-[#0A0A0A] shadow-lg shadow-white/5">
          <div className="border-b border-gray-800 px-5 py-5 sm:px-7 sm:py-6">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Редактирование анкеты</h1>
            <p className="mt-1 text-sm text-gray-400">Здесь вы сможете изменить свои данные</p>
          </div>
          <div className="space-y-5 px-5 py-6 sm:px-7 sm:py-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div
                className="size-20 rounded-full bg-cover bg-center sm:size-24"
                style={{ backgroundImage: `url('${displayUser.avatarUrl}')` }}
              />
              <div className="flex-1 text-center sm:text-left">
                <label className="mb-1 block text-sm font-medium text-gray-300">Фото профиля</label>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">Имя</label>
                <input
                  type="text"
                  value={user.firstName || ''}
                  readOnly
                  className="w-full cursor-default rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">Фамилия</label>
                <input
                  type="text"
                  value={user.lastName || ''}
                  readOnly
                  className="w-full cursor-default rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">Должность</label>
              <input
                type="text"
                value={displayUser.job_title || ''}
                readOnly
                className="w-full cursor-default rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">
                Отдел / Команда
              </label>
              <input
                type="text"
                value={user.workInfo?.department || ''}
                readOnly
                className="w-full cursor-default rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">Город</label>
              <input
                type="text"
                value={user.workInfo?.city || ''}
                readOnly
                className="w-full cursor-default rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">О себе</label>
              <textarea
                rows={4}
                value={user.about || ''}
                readOnly
                className="w-full cursor-default resize-none rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#8E8E93]">
                Интересы (через запятую)
              </label>
              <input
                type="text"
                value={(user.interests || []).map((i) => i.name).join(', ')}
                readOnly
                className="w-full cursor-default rounded-lg bg-[#2C2C2E] px-4 py-2.5 text-white outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Пример: TypeScript, футбол, кино</p>
            </div>
          </div>
          <div className="flex justify-end border-t border-gray-800 px-5 py-5 sm:px-7">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full bg-[#2C2C2E] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#3C3C3E]"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
