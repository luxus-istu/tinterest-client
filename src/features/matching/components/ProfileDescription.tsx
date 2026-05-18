import { Chip } from '@heroui/react'
import type { MatchingProfile } from '../types'
import {
  COMMUNICATION_FORMAT_LABELS,
  GOAL_LABELS,
  PERSONALITY_LABELS,
  WORK_FORMAT_LABELS,
} from '../lib/labels'

interface ProfileDescriptionProps {
  profile: MatchingProfile
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-muted">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

export default function ProfileDescription({ profile }: ProfileDescriptionProps) {
  return (
    <div className="mx-auto mt-4 w-full max-w-md px-1">
      {profile.about && (
        <p className="mb-4 text-sm leading-relaxed text-foreground">
          {profile.about}
        </p>
      )}

      <div className="mb-4 space-y-1.5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Работа</h3>
        <InfoRow label="Должность" value={profile.jobTitle} />
        <InfoRow label="Отдел" value={profile.department} />
        <InfoRow label="Город" value={profile.city} />
        {profile.workFormat && WORK_FORMAT_LABELS[profile.workFormat] && (
          <InfoRow
            label="Формат"
            value={WORK_FORMAT_LABELS[profile.workFormat]}
          />
        )}
      </div>

      <div className="mb-4 space-y-1.5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Предпочтения</h3>
        <InfoRow label="Цель" value={GOAL_LABELS[profile.goal] ?? profile.goal} />
        <InfoRow
          label="Тип"
          value={PERSONALITY_LABELS[profile.personalityType] ?? profile.personalityType}
        />
        {profile.communicationFormat.length > 0 && (
          <InfoRow
            label="Общение"
            value={profile.communicationFormat
              .map((f) => COMMUNICATION_FORMAT_LABELS[f])
              .filter(Boolean)
              .join(', ')}
          />
        )}
      </div>

      <div className="pb-6">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Интересы</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => (
            <Chip key={interest.name} size="sm" variant="secondary">
              <Chip.Label>{interest.name}</Chip.Label>
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )
}
