'use client'

import { useEffect } from 'react'
import useAuthStore from '../store/auth.store'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { profileApi } from '../api/profile.api'
import type {
  LoginRequest,
  RegisterRequest,
  ResendEmailOtpRequest,
  VerifyEmailOtpRequest,
} from '../types'
import type { ErrorResponse } from '@/src/types'

export const useAuth = () => {
  const { user, accessToken, role, clearAuth, setAccessToken, setUser, isAuthChecked, setAuthChecked } = useAuthStore()

  useEffect(() => {
    if (isAuthChecked) return
    useAuthStore
      .getState()
      .bootstrap()
      .then(() => profileApi.getMe())
      .then((profile) => {
        setUser(profile)
      })
      .catch(() => {
        if (!useAuthStore.getState().accessToken) {
          clearAuth()
        }
      })
      .finally(() => {
        setAuthChecked(true)
      })
  }, [clearAuth, isAuthChecked, setAccessToken, setAuthChecked, setUser])

  return {
    user,
    role,
    isAuthenticated: !!accessToken,
    isLoading: !isAuthChecked,
  }
}

export const useAuthActions = () => {
  const { setAccessToken } = useAuthStore()
  const { clearAuth } = useAuthStore()

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
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
