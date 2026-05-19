import { User } from '@/src/types'
import { create } from 'zustand'
import { getRoleFromJwt, type AuthRole } from '../utils/jwt'

interface AuthState {
  user?: User
  accessToken?: string
  role?: AuthRole
  isAuthChecked: boolean
  isRefreshing: boolean
  refreshSubscribers: Array<{
    onSuccess: (token: string) => void
    onError: (error: unknown) => void
  }>
}

interface AuthActions {
  setAuth: (user: User, accessToken: string) => void
  setUser: (user: User) => void
  setRole: (role?: AuthRole) => void
  clearAuth: () => void
  setAccessToken: (token: string) => void
  clearSession: () => void
  setAuthChecked: (value: boolean) => void
  setIsRefreshing: (value: boolean) => void
  subscribeRefresh: (onSuccess: (token: string) => void, onError: (error: unknown) => void) => void
  notifyRefreshSuccess: (token: string) => void
  notifyRefreshError: (error: unknown) => void
}

interface AuthStore extends AuthState, AuthActions {}

const initialState: AuthState = {
  accessToken: undefined,
  role: undefined,
  user: undefined,
  isAuthChecked: false,
  isRefreshing: false,
  refreshSubscribers: [],
}

const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  setAuth: (user, accessToken) =>
    set({ user, accessToken, role: getRoleFromJwt(accessToken) }),
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  clearAuth: () => {
    get().clearSession()
  },
  setAccessToken: (token) =>
    set({ accessToken: token, role: getRoleFromJwt(token) }),
  clearSession: () => {
    set({ user: undefined, accessToken: undefined, role: undefined, isRefreshing: false, refreshSubscribers: [] })
  },
  setAuthChecked: (value) => {
    set({ isAuthChecked: value })
  },
  setIsRefreshing: (value) => {
    set({ isRefreshing: value })
  },
  subscribeRefresh: (onSuccess, onError) => {
    const refreshSubscribers = get().refreshSubscribers
    refreshSubscribers.push({ onSuccess, onError })
    set({ refreshSubscribers: refreshSubscribers })
  },
  notifyRefreshSuccess: (token) => {
    const subscribers = get().refreshSubscribers
    set({ refreshSubscribers: [] })
    for (const subscriber of subscribers) {
      try {
        subscriber.onSuccess(token)
      } catch {
        // Subscriber error must not prevent other subscribers from running.
      }
    }
  },
  notifyRefreshError: (error) => {
    const subscribers = get().refreshSubscribers
    set({ refreshSubscribers: [] })
    for (const subscriber of subscribers) {
      try {
        subscriber.onError(error)
      } catch {
        // Subscriber error must not prevent other subscribers from running.
      }
    }
  },
}))

export default useAuthStore
