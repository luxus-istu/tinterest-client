import { User } from "@/src/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user?: User;
  token?: string;
  isInitialized: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setInitialized: () => void;
}

interface AuthStore extends AuthState, AuthActions { };

const initialState: AuthState = {
  isInitialized: false,
  token: undefined,
  user: undefined,
}

const useAuthStore = create<AuthStore>()(persist((set) => ({
  ...initialState,
  setAuth: (user: User, token: string) => {
    set({
      user,
      token,
      isInitialized: true
    })
  },
  clearAuth: () => {
    set({
      user: undefined,
      token: undefined,
      isInitialized: true
    })
  },
  setInitialized: () => {
    set({
      isInitialized: true
    })
  }
}), {
  name: "tinterest-auth",
}));

export default useAuthStore;
