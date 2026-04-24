'use client'

import { useEffect } from "react";
import useAuthStore from "../store/auth.store"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { LoginRequest, RegisterRequest, ResendEmailOtpRequest, VerifyEmailOtpRequest } from "../types";

export const useAuth = () => {
  const { user, isInitialized, setInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      setInitialized();
    }
  }, [isInitialized, setInitialized]);


  return {
    isInitialized,
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized
  }
}

export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
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
      loginMutation.error ||
      logoutMutation.error ||
      registerMutation.error ||
      verifyEmailOtpMutation.error ||
      resendEmailOtpMutation.error,
  }
}
