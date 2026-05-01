import type { InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { parseErrorResponse } from './error'
import useAuthStore from '@/src/features/auth/store/auth.store'

const baseURL =
  process.env.NODE_ENV === 'development' ? '/api/proxy' : process.env.NEXT_PUBLIC_API_URL

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url === '/auth/refresh') {
    return config
  }

  const token = useAuthStore.getState().accessToken ?? null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (!originalRequest || originalRequest.url === '/auth/refresh') {
        useAuthStore.getState().clearSession()
        if (axios.isAxiosError(error) && error.response?.data) {
          return Promise.reject(parseErrorResponse(error.response.data))
        }
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        useAuthStore.getState().clearSession()
        if (axios.isAxiosError(error) && error.response?.data) {
          return Promise.reject(parseErrorResponse(error.response.data))
        }
        return Promise.reject(error)
      }

      if (useAuthStore.getState().isRefreshing) {
        return new Promise((resolve) => {
          useAuthStore.getState().subscribeRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      useAuthStore.getState().setIsRefreshing(true)

      try {
        const refreshResponse = await apiClient.post('/auth/refresh')
        const newAccessToken = refreshResponse.data.accessToken as string
        useAuthStore.getState().setAccessToken(newAccessToken)
        useAuthStore.getState().notifyRefresh(newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearSession()
        if (axios.isAxiosError(refreshError) && refreshError.response?.data) {
          return Promise.reject(parseErrorResponse(refreshError.response.data))
        }
        return Promise.reject(refreshError)
      } finally {
        useAuthStore.getState().setIsRefreshing(false)
      }
    }

    if (axios.isAxiosError(error) && error.response?.data) {
      return Promise.reject(parseErrorResponse(error.response.data))
    }
    return Promise.reject(error)
  }
)
