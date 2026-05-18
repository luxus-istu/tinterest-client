import { User } from '@/src/types'
import { create } from 'zustand'
import { getRoleFromJwt, type AuthRole } from '../utils/jwt'

interface AuthState {
  user?: User
  accessToken?: string
  role?: AuthRole
  isRefreshing: boolean
  refreshSubscribers: Array<(token: string) => void>
}

interface AuthActions {
  setAuth: (user: User, accessToken: string) => void
  setUser: (user: User) => void
  setRole: (role?: AuthRole) => void
  clearAuth: () => void
  setAccessToken: (token: string) => void
  clearSession: () => void
  setIsRefreshing: (value: boolean) => void
  subscribeRefresh: (callback: (token: string) => void) => void
  notifyRefresh: (token: string) => void
}

interface AuthStore extends AuthState, AuthActions {}

const initialState: AuthState = {
  accessToken: undefined,
  role: undefined,
  user: undefined,
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
  setIsRefreshing: (value) => {
    set({ isRefreshing: value })
  },
  subscribeRefresh: (callback) => {
    const refreshSubscribers = get().refreshSubscribers
    refreshSubscribers.push(callback)
    set({ refreshSubscribers: refreshSubscribers })
  },
  notifyRefresh: (token) => {
    const subscribers = get().refreshSubscribers
    set({ refreshSubscribers: [] })
    for (const cb of subscribers) {
      try {
        cb(token)
      } catch {
        // Subscriber error must not prevent other subscribers from running.
      }
    }
  },
}))

export default useAuthStore
