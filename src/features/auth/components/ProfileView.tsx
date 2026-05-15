"use client"

import { useQuery } from "@tanstack/react-query"
import { profileApi } from "@/src/features/auth/api/profile.api"
import { Card } from "@heroui/react"
import Image from "next/image"
import useAuthStore from "@/src/features/auth/store/auth.store"
import { MapPin, Briefcase, Sparkles, Calendar, User } from "lucide-react"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ProfileView() {
  const storedUser = useAuthStore((s) => s.user)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileApi.getMe(),
    initialData: storedUser,
  })

  const profile = data

  if (isLoading && !profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-(--surface-secondary)" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6">
        <User size={48} className="mb-4 text-(--muted)" strokeWidth={1.5} />
        <p className="text-(--muted)">Не удалось загрузить профиль</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pt-4 pb-16">
      <Card
        className="overflow-hidden"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          borderRadius: "24px",
        }}
      >
        <div className="flex flex-col items-center px-6 pt-8">
          <div className="relative mb-4">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={112}
                height={112}
                className="rounded-full object-cover ring-4 ring-(--accent)"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-(--surface-secondary) ring-4 ring-(--accent)">
                <User size={40} className="text-(--muted)" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-(--foreground)">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.middleName && (
            <p className="mt-0.5 text-sm text-(--muted)">{profile.middleName}</p>
          )}
        </div>

        <div className="space-y-4 px-6 py-6">
          {profile.city && (
            <InfoRow icon={MapPin} label="Город" value={profile.city} />
          )}
          {profile.jobTitle && (
            <InfoRow
              icon={Briefcase}
              label="Должность"
              value={
                profile.jobTitle +
                (profile.department ? ` · ${profile.department}` : "")
              }
            />
          )}
          {profile.goal && (
            <InfoRow icon={Sparkles} label="Цель" value={profile.goal} />
          )}
          {profile.dateOfBirth && (
            <InfoRow
              icon={Calendar}
              label="Дата рождения"
              value={formatDate(profile.dateOfBirth)}
            />
          )}
          {profile.personalityType && (
            <div className="flex items-center gap-3 rounded-xl bg-(--surface-secondary) px-4 py-3">
              <span className="text-xs font-medium text-(--muted)">Тип личности</span>
              <span className="text-sm font-semibold text-(--foreground)">
                {profile.personalityType}
              </span>
            </div>
          )}
        </div>

        {profile.about && (
          <div className="border-t border-(--border) px-6 py-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-(--muted)">
              О себе
            </h3>
            <p className="text-sm leading-relaxed text-(--foreground)">
              {profile.about}
            </p>
          </div>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div className="border-t border-(--border) px-6 py-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-(--muted)">
              Интересы
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <span
                  key={typeof interest === "string" ? interest : i}
                  className="rounded-full bg-(--surface-tertiary) px-3 py-1 text-xs font-medium text-(--surface-tertiary-foreground)"
                >
                  {typeof interest === "string" ? interest : interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.timeSlots && profile.timeSlots.length > 0 && (
          <div className="border-t border-(--border) px-6 py-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-(--muted)">
              Удобное время
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.timeSlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full bg-(--surface-secondary) px-3 py-1 text-xs font-medium text-(--surface-secondary-foreground)"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size: number; className: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-(--surface-secondary) px-4 py-3">
      <Icon size={18} className="text-(--muted) shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-(--muted)">{label}</p>
        <p className="text-sm font-semibold text-(--foreground)">{value}</p>
      </div>
    </div>
  )
}
