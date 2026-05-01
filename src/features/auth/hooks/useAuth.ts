'use client'

import { useEffect } from 'react'
import useAuthStore from '../store/auth.store'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import type {
  LoginRequest,
  RegisterRequest,
  ResendEmailOtpRequest,
  VerifyEmailOtpRequest,
} from '../types'
import type { ErrorResponse } from '@/src/types'

export const useAuth = () => {
  const { user, clearAuth, setAccessToken, isRefreshing, setIsRefreshing } = useAuthStore()

  useEffect(() => {
    setIsRefreshing(true)
    authApi
      .refresh()
      .then((data) => {
        setAccessToken(data.accessToken)
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setIsRefreshing(false)
      })
  }, [clearAuth, setAccessToken, setIsRefreshing])

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !isRefreshing,
  }
}

export const useAuthActions = () => {
  const { setAuth, clearAuth } = useAuthStore()

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth()
    },
  })

  const verifyEmailOtpMutation = useMutation({
    mutationFn: (data: VerifyEmailOtpRequest) => authApi.verifyEmailOtp(data),
  })

  const resendEmailOtpMutation = useMutation({
    mutationFn: (data: ResendEmailOtpRequest) => authApi.resendEmailOtp(data),
  })

  return {
    register: registerMutation.mutateAsync,
    verifyEmailOtp: verifyEmailOtpMutation.mutateAsync,
    resendEmailOtp: resendEmailOtpMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    isVerifyingEmailOtp: verifyEmailOtpMutation.isPending,
    isResendingEmailOtp: resendEmailOtpMutation.isPending,
    isLogging: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error:
      (loginMutation.error as ErrorResponse | null) ||
      (logoutMutation.error as ErrorResponse | null) ||
      (registerMutation.error as ErrorResponse | null) ||
      (verifyEmailOtpMutation.error as ErrorResponse | null) ||
      (resendEmailOtpMutation.error as ErrorResponse | null),
  }
}
