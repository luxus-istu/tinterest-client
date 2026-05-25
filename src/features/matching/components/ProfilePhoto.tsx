import { Button, Chip } from '@heroui/react'
import { Heart, X } from 'lucide-react'
import { memo } from 'react'
import type { MatchingProfile } from '../types'
import { DISLIKE_COLOR, LIKE_COLOR, WORK_FORMAT_LABELS } from '../lib/labels'

interface ProfilePhotoProps {
  profile: MatchingProfile
  onLike: () => void
  onDislike: () => void
}

const ProfilePhoto = memo(function ProfilePhoto({
  profile,
  onLike,
  onDislike,
}: ProfilePhotoProps) {
  return (
    <div className="relative h-[calc(100vh-12rem)] w-full overflow-hidden rounded-3xl bg-surface shadow-2xl">
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.avatarUrl})` }}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute right-0 bottom-0 left-0 z-10 h-44 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      {/* Name + chips - top left */}
      <div className="absolute top-5 left-5 z-20 flex flex-col items-start gap-2">
        <div className="rounded-2xl bg-black/40 px-4 py-1.5 backdrop-blur-md">
          <span data-testid="card-name" className="text-2xl font-bold text-white">
            {profile.firstName}, {profile.age}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile.city && (
            <Chip size="sm" className="bg-black/40 text-white backdrop-blur-md">
              <Chip.Label>{profile.city}</Chip.Label>
            </Chip>
          )}
          {profile.workFormat && WORK_FORMAT_LABELS[profile.workFormat] && (
            <Chip size="sm" className="bg-black/40 text-white backdrop-blur-md">
              <Chip.Label>{WORK_FORMAT_LABELS[profile.workFormat]}</Chip.Label>
            </Chip>
          )}
        </div>
      </div>

      {/* Photo dots */}
      {profile.photos.length > 1 && (
        <div className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          <div className="h-1.5 w-5 rounded-full bg-white" />
          {profile.photos.slice(1).map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />
          ))}
        </div>
      )}

      {/* Action buttons - bottom of photo */}
      <div className="absolute right-0 bottom-6 left-0 z-20 flex items-center justify-between px-16">
        <Button
          data-testid="dislike"
          isIconOnly
          size="lg"
          onPress={onDislike}
          className="h-16 w-16 rounded-full shadow-lg transition-transform active:scale-90"
          style={{ backgroundColor: DISLIKE_COLOR }}
        >
          <X size={32} strokeWidth={3} className="text-white" />
        </Button>
        <Button
          data-testid="like"
          isIconOnly
          size="lg"
          onPress={onLike}
          className="h-16 w-16 rounded-full shadow-lg transition-transform active:scale-90"
          style={{ backgroundColor: LIKE_COLOR }}
        >
          <Heart size={32} strokeWidth={3} className="text-white" />
        </Button>
      </div>
    </div>
  )
})

export default ProfilePhoto;
