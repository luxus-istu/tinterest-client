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
  const [refreshCounter, setRefreshCounter] = useState(0)
  const [page, setPage] = useState(0)
  const dataKeyRef = useRef<unknown>(undefined)
  const [hasMore, setHasMore] = useState(true)

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true),
  )

  const query = useQuery({
    queryKey: ["recommendations", filters, refreshCounter, page],
    queryFn: async () => {
      const response = hasFilters
        ? await matchingApi.getFilteredRecommendations(filters, page)
        : await matchingApi.getRecommendations(10)
      setHasMore(response.hasMore)
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
  const needsMore = profiles.length === 0 && data.length > 0 && hasMore

  const loadMore = useCallback(() => {
    if (!hasMore) return
    if (hasFilters) {
      setPage((prev) => prev + 1)
    } else {
      setRefreshCounter((prev) => prev + 1)
    }
  }, [hasFilters, hasMore])

  const advance = useCallback((count: number) => {
    setIndex((prev) => prev + count)
  }, [])

  const refresh = useCallback(() => {
    setPage(0)
    setIndex(0)
    setRefreshCounter((prev) => prev + 1)
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
    refresh,
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
