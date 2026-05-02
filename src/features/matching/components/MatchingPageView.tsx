'use client'

import { Button } from '@heroui/react'
import { Heart } from 'lucide-react'
import { useCallback, useState } from 'react'
import { mockFilters, mockProfiles } from '../mock'
import { FilterBar } from './FilterBar'
import { ProfileCard } from './ProfileCard'

export function MatchingPageView() {
  const [profiles, setProfiles] = useState([...mockProfiles])
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const currentProfile = profiles[0] ?? null
  const nextProfile = profiles[1] ?? null

  const handleLike = useCallback(() => {
    setProfiles((prev) => prev.slice(1))
  }, [])

  const handleDislike = useCallback(() => {
    setProfiles((prev) => prev.slice(1))
  }, [])

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-x-hidden bg-background">
      <FilterBar
        filters={mockFilters}
        activeFilters={activeFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onToggleFilter={toggleFilter}
      />

      <div className="px-4 pt-4">
        {currentProfile ? (
          <ProfileCard
            key={currentProfile.id}
            profile={currentProfile}
            nextProfile={nextProfile}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <Heart size={64} className="text-muted" />
            <h2 className="text-xl font-bold text-foreground">Анкеты закончились</h2>
            <p className="text-sm text-muted">Загляните позже — появятся новые люди</p>
            <Button variant="secondary" onPress={() => setProfiles([...mockProfiles])}>
              Обновить
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
