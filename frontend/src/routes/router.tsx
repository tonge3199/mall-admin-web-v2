import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/app/Layout'
import { AuthGuard } from '@/auth/guard'
import { HomePage } from '@/pages/Home'
import { LoginPage } from '@/pages/Login'
import { NotFoundPage } from '@/pages/NotFound'

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <Layout />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: 'home', element: <HomePage /> },
            // TODO: add nested routes for pms/oms/sms modules
        ],
    },
    { path: '*', element: <NotFoundPage /> },
])
