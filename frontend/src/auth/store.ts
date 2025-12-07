import { create } from 'zustand'

export type UserProfile = {
    id: number | null
    nickName?: string
    roles?: string[]
}

type AuthState = {
    token: string | null
    user: UserProfile | null
    setToken: (token: string | null) => void
    setUser: (user: UserProfile | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    logout: () => set({ token: null, user: null }),
}))
