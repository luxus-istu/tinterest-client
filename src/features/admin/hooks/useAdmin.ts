"use client"

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminApi } from '../api/adminApi'

const SEARCH_DEBOUNCE_MS = 500
const DEFAULT_PAGE_SIZE = 10

export function useAdmin() {
  const queryClient = useQueryClient()
  const [searchText, setSearchText] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [usersPage, setUsersPage] = useState(0)
  const [usersPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [interestsPage, setInterestsPage] = useState(0)
  const [interestsPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEmailFilter(searchText.trim())
      setUsersPage(0)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [searchText])

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', emailFilter, usersPage],
    queryFn: () =>
      adminApi.getUsers({
        email: emailFilter,
        page: usersPage,
        size: usersPageSize,
      }),
    staleTime: 30_000,
  })

  const statisticsQuery = useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: adminApi.getStatistics,
    staleTime: 60_000,
  })

  const interestsQuery = useQuery({
    queryKey: ['admin', 'interests'],
    queryFn: adminApi.getInterests,
    staleTime: 60_000,
  })

  const blockMutation = useMutation({
    mutationFn: adminApi.blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Пользователь заблокирован')
    },
    onError: () => toast.error('Не удалось заблокировать пользователя'),
  })

  const unblockMutation = useMutation({
    mutationFn: adminApi.unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Пользователь разблокирован')
    },
    onError: () => toast.error('Не удалось разблокировать пользователя'),
  })

  const addInterestMutation = useMutation({
    mutationFn: (name: string) => adminApi.addInterest(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interests'] })
      toast.success('Интерес добавлен')
    },
    onError: () => toast.error('Не удалось добавить интерес'),
  })

  const deleteInterestMutation = useMutation({
    mutationFn: adminApi.deleteInterest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'interests'] })
      toast.success('Интерес удалён')
    },
    onError: () => toast.error('Не удалось удалить интерес'),
  })

  return {
    usersQuery,
    statisticsQuery,
    interestsQuery,
    searchText,
    setSearchText,
    emailFilter,
    usersPage,
    setUsersPage,
    usersPageSize,
    interestsPage,
    setInterestsPage,
    interestsPageSize,
    blockMutation,
    unblockMutation,
    addInterestMutation,
    deleteInterestMutation,
  }
}
