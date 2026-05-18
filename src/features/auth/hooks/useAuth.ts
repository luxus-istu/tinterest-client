'use client'

import { useEffect, useState } from 'react'
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
  const { user, accessToken, role, clearAuth, setAccessToken, setUser } = useAuthStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    authApi
      .refresh()
      .then((data) => {
        setAccessToken(data.accessToken)
        return profileApi.getMe()
      })
      .then((profile) => {
        setUser(profile)
      })
      .catch(() => {
        clearAuth()
      })
      .finally(() => {
        setChecked(true)
      })
  }, [clearAuth, setAccessToken, setUser])

  return {
    user,
    role,
    isAuthenticated: !!accessToken,
    isLoading: !checked,
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
