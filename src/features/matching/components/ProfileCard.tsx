import { useRef } from 'react'
import type { MatchingProfile } from '../types'
import { useSwipe } from '../hooks/useSwipe'
import { SwipeIndicator } from './SwipeIndicator'
import { ProfilePhoto } from './ProfilePhoto'
import { ProfileDescription } from './ProfileDescription'

interface ProfileCardProps {
  profile: MatchingProfile
  nextProfile: MatchingProfile | null
  onLike: () => void
  onDislike: () => void
}

export function ProfileCard({
  profile,
  nextProfile,
  onLike,
  onDislike,
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const {
    translateX,
    rotate,
    opacity,
    scale,
    direction,
    isAnimating,
    cardTransition,
    handlers,
    onLike: handleLike,
    onDislike: handleDislike,
  } = useSwipe(onLike, onDislike)

  return (
    <div className="flex w-full flex-col">
      <div className="relative mx-auto w-full max-w-md">
        {/* Next card peeking behind */}
        {nextProfile && (
          <div
            className="absolute inset-x-0 top-2 z-0 overflow-hidden rounded-3xl bg-surface shadow-xl"
            style={{
              height: 'calc(100vh - 12rem - 8px)',
              transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div
              className="h-full w-full bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${nextProfile.avatarUrl})` }}
            />
          </div>
        )}

        {/* Main card */}
        <div
          ref={cardRef}
          {...handlers}
          style={{
            transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`,
            opacity,
            transition: cardTransition,
            touchAction: 'pan-y',
          }}
          className="relative z-10 cursor-grab select-none active:cursor-grabbing"
        >
          <SwipeIndicator direction={direction} side="like" />
          <SwipeIndicator direction={direction} side="dislike" />
          <ProfilePhoto
            profile={profile}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </div>
      </div>

      <ProfileDescription profile={profile} />
    </div>
  )
}
