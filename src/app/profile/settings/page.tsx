'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [visibility, setVisibility] = useState<'colleagues' | 'noone'>('colleagues')

  return (
    <div className="bg-background min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-4xl bg-[#0A0A0A] shadow-lg shadow-white/5">
          <div className="border-b border-gray-800 px-5 py-5 sm:px-7 sm:py-6">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Настройки</h1>
            <p className="mt-1 text-sm text-gray-400">
              Управляйте конфиденциальностью и уведомлениями
            </p>
          </div>
          <div className="divide-y divide-gray-800 px-5 sm:px-7">
            <div className="space-y-4 py-5">
              <h2 className="text-lg font-semibold text-white">Уведомления</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">Email-рассылка</p>
                  <p className="text-sm text-[#8E8E93]">Новые лайки, совпадения и сообщения</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-blue-500' : 'bg-[#2C2C2E]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">Push-уведомления</p>
                  <p className="text-sm text-[#8E8E93]">Активность в реальном времени</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications ? 'bg-blue-500' : 'bg-[#2C2C2E]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="space-y-4 py-5">
              <h2 className="text-lg font-semibold text-white">Приватность</h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-white">Видимость профиля</p>
                  <p className="text-sm text-[#8E8E93]">Кто может видеть вашу анкету</p>
                </div>
                <div className="w-full sm:w-64">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'colleagues' | 'noone')}
                    className="w-full rounded-lg bg-[#2C2C2E] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="colleagues">Только коллеги — рекомендуем</option>
                    <option value="noone">Никто (скрыть анкету)</option>
                  </select>
                  <p className="mt-1 text-xs text-[#8E8E93]">
                    {visibility === 'colleagues'
                      ? 'Ваш профиль виден только коллегам из компании'
                      : 'Ваш профиль скрыт, вы не появитесь в поиске'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-gray-800 px-5 py-5 sm:px-7">
            <button
              type="button"
              onClick={() => {
                // TODO: связать с сохранением настроек в store/API
                console.log('Настройки сохранены:', {
                  emailNotifications,
                  pushNotifications,
                  visibility,
                })
                alert('Настройки сохранены (демо)')
              }}
              className="rounded-full bg-blue-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Сохранить изменения
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#8E8E93]">
          Tinterest — знакомства среди коллег • версия 1.0
        </p>
      </div>
    </div>
  )
}
