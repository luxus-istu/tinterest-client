import { User } from '@/src/types'
import { create } from 'zustand'

interface AuthState {
  user?: User
  accessToken?: string
  isRefreshing: boolean
  refreshSubscribers: Array<(token: string) => void>
}

interface AuthActions {
  setAuth: (user: User, accessToken: string) => void
  setUser: (user: User) => void
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
  user: undefined,
  isRefreshing: false,
  refreshSubscribers: [],
}

const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  setAuth: (user, accessToken) => set({ user, accessToken }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: undefined, accessToken: undefined }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearSession: () => {
    set({ user: undefined, accessToken: undefined, isRefreshing: false, refreshSubscribers: [] })
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
    get().refreshSubscribers.forEach((cb) => cb(token))
    set({ refreshSubscribers: [] })
  },
}))

export default useAuthStore
