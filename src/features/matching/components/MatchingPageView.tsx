'use client'

import { Button } from '@heroui/react'
import { Heart } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterestFilters, useRecommendations, useSwipeAction } from '../hooks/useMatching'
import FilterBar from './FilterBar'
import ProfileCard from './ProfileCard'
import type { MatchingFilter } from '../types'

export default function MatchingPageView() {
  const {
    profiles,
    advance,
    isLoading,
    loadMore,
    needsMore,
    error,
    setFilters,
  } = useRecommendations()
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const swipeMutation = useSwipeAction()
  const { data: interestFilters = [] } = useInterestFilters()

  const filtersList: MatchingFilter[] = useMemo(
    () => interestFilters,
    [interestFilters],
  )

  const currentProfile = profiles[0] ?? null
  const nextProfile = profiles[1] ?? null

  useEffect(() => {
    if (needsMore && !isLoading) {
      loadMore()
    }
  }, [needsMore, isLoading, loadMore])

  const handleLike = useCallback(() => {
    const profile = profiles[0]
    if (!profile) return
    swipeMutation.mutate({ toUserId: profile.id, reaction: 'LIKE' })
    advance(1)
  }, [profiles, advance, swipeMutation])

  const handleDislike = useCallback(() => {
    const profile = profiles[0]
    if (!profile) return
    swipeMutation.mutate({ toUserId: profile.id, reaction: 'DISLIKE' })
    advance(1)
  }, [profiles, advance, swipeMutation])

  const toggleFilter = useCallback(
    (id: string) => {
      setActiveFilters((prev) => {
        const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        if (next.length > 0) {
          setFilters({ interestIds: next.map(Number).filter(Boolean) })
        } else {
          setFilters({})
        }
        return next
      })
    },
    [setFilters],
  )

  const resetAll = useCallback(() => {
    setActiveFilters([])
    setFilters({})
  }, [setFilters])

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-x-hidden bg-background">
      <FilterBar
        filters={filtersList}
        activeFilters={activeFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onToggleFilter={toggleFilter}
      />

      <div className="px-4 pt-4">
        {swipeMutation.isError && (
          <div className="mb-3 rounded-xl bg-danger/10 px-4 py-2 text-sm text-danger">
            Не удалось сохранить действие. Попробуйте позже.
          </div>
        )}
        {error && (
          <div className="mb-3 rounded-xl bg-danger/10 px-4 py-2 text-sm text-danger">
            Не удалось загрузить анкеты. Попробуйте позже.
          </div>
        )}
        {isLoading && profiles.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-muted">Загрузка...</p>
          </div>
        ) : currentProfile ? (
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
            <Button variant="secondary" onPress={resetAll}>
              Обновить
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
