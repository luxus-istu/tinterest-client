"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import matchingApi from "../api/matching.api"
import { mapUserCardToProfile } from "../types"
import type { MatchingProfile, MatchingFilter } from "../types"
import type { RecommendationFiltersDto } from "../types/api"

export function useRecommendations() {
  const [filters, setFilters] = useState<RecommendationFiltersDto>({})
  const [index, setIndex] = useState(0)
  const dataKeyRef = useRef<unknown>(undefined)

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true),
  )

  const query = useQuery({
    queryKey: ["recommendations", filters],
    queryFn: async () => {
      const response = hasFilters
        ? await matchingApi.getFilteredRecommendations(filters)
        : await matchingApi.getRecommendations(10)
      return response.users.map(mapUserCardToProfile)
    },
    staleTime: 0,
  })

  const data: MatchingProfile[] = useMemo(() => query.data ?? [], [query.data])

  useEffect(() => {
    if (query.data !== dataKeyRef.current) {
      dataKeyRef.current = query.data ?? undefined
      setIndex(0)
    }
  }, [query.data])

  const profiles = useMemo(() => data.slice(index), [data, index])
  const needsMore = profiles.length === 0 && data.length > 0

  const loadMore = useCallback(() => {
    setFilters((prev) => ({ ...prev }))
  }, [])

  const advance = useCallback((count: number) => {
    setIndex((prev) => prev + count)
  }, [])

  return {
    profiles,
    advance,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    loadMore,
    needsMore,
    filters,
    setFilters,
  }
}

export function useSwipeAction() {
  return useMutation({
    mutationFn: matchingApi.swipe,
  })
}

export function useInterestFilters() {
  return useQuery({
    queryKey: ["interests"],
    queryFn: matchingApi.getInterests,
    select: (data): MatchingFilter[] =>
      data.map((interest) => ({
        id: interest.id.toString(),
        label: interest.name,
      })),
    staleTime: 5 * 60 * 1000,
  })
}
