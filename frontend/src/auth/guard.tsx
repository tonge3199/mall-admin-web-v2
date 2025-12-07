import { Navigate, useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useAuthStore } from './store'

export function AuthGuard({ children }: PropsWithChildren) {
    const token = useAuthStore((s) => s.token)
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
}
