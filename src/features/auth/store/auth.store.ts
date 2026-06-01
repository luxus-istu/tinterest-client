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
  isBootstrapping: boolean
  bootstrapSubscribers: Array<{
    onSuccess: () => void
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
  subscribeBootstrap: (onSuccess: () => void, onError: (error: unknown) => void) => void
  notifyBootstrapSuccess: () => void
  notifyBootstrapError: (error: unknown) => void
  bootstrap: () => Promise<void>
}

interface AuthStore extends AuthState, AuthActions {}

const initialState: AuthState = {
  accessToken: undefined,
  role: undefined,
  user: undefined,
  isAuthChecked: false,
  isRefreshing: false,
  refreshSubscribers: [],
  isBootstrapping: false,
  bootstrapSubscribers: [],
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
    set({ user: undefined, accessToken: undefined, role: undefined, isRefreshing: false, refreshSubscribers: [], isBootstrapping: false, bootstrapSubscribers: [] })
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
      }
    }
  },
  subscribeBootstrap: (onSuccess, onError) => {
    const bootstrapSubscribers = get().bootstrapSubscribers
    bootstrapSubscribers.push({ onSuccess, onError })
    set({ bootstrapSubscribers: bootstrapSubscribers })
  },
  notifyBootstrapSuccess: () => {
    const subscribers = get().bootstrapSubscribers
    set({ bootstrapSubscribers: [] })
    for (const subscriber of subscribers) {
      try {
        subscriber.onSuccess()
      } catch {
      }
    }
  },
  notifyBootstrapError: (error) => {
    const subscribers = get().bootstrapSubscribers
    set({ bootstrapSubscribers: [] })
    for (const subscriber of subscribers) {
      try {
        subscriber.onError(error)
      } catch {
      }
    }
  },

  bootstrap: async () => {
    if (get().isBootstrapping) {
      return new Promise<void>((resolve, reject) => {
        get().subscribeBootstrap(resolve, reject)
      })
    }

    set({ isBootstrapping: true })
    try {
      const mod = await import('@/src/features/auth/api/auth.api')
      if (!mod?.authApi?.refresh) throw new Error('authApi.refresh not available')
      const data = await mod.authApi.refresh()
      if (data?.accessToken) {
        get().setAccessToken(data.accessToken)
      }
      get().notifyBootstrapSuccess()
    } catch (err) {
      get().clearSession()
      get().notifyBootstrapError(err)
      throw err
    } finally {
      set({ isBootstrapping: false })
    }
  },
}))

export default useAuthStore
