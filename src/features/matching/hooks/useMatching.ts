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

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true),
  )

  const query = useQuery({
    queryKey: ["recommendations", filters, refreshCounter, page],
    queryFn: async () => {
      const response = hasFilters
        ? await matchingApi.getFilteredRecommendations(filters, page)
        : await matchingApi.getRecommendations(10)
      return {
        hasMore: response.hasMore,
        profiles: response.users.map(mapUserCardToProfile),
      }
    },
    staleTime: 0,
  })

  const data: MatchingProfile[] = useMemo(() => query.data?.profiles ?? [], [query.data])
  const hasMore = query.data?.hasMore ?? true

  useEffect(() => {
    if (query.data?.profiles !== dataKeyRef.current) {
      dataKeyRef.current = query.data?.profiles ?? undefined
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

  const updateFilters = useCallback((nextFilters: RecommendationFiltersDto) => {
    setFilters(nextFilters)
    setPage(0)
    setIndex(0)
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
    setFilters: updateFilters,
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
