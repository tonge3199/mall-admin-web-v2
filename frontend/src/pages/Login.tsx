import { Button, Card, Form, Input, Typography, message } from 'antd'
import { api } from '@/api/client'
import { useAuthStore } from '@/auth/store'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

interface LoginResult {
    token: string
    tokenHead: string
}

export function LoginPage() {
    const setToken = useAuthStore((state) => state.setToken)
    const token = useAuthStore((state) => state.token)
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    // If already logged in, redirect to home
    if (token) {
        const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home'
        navigate(redirectTo, { replace: true })
    }

    const handleFinish = async (values: { username: string; password: string }) => {
        setLoading(true)
        try {
            const res = await api.post<unknown, { data: LoginResult }>('/admin/login', values)
            const fullToken = `${res.data.tokenHead}${res.data.token}`
            setToken(fullToken)
            message.success('登录成功')
            const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home'
            navigate(redirectTo, { replace: true })
        } catch (error) {
            // Error is handled by axios interceptor
            console.error('Login failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="full-center">
            <Card title="Mall Admin 登录" style={{ width: 360 }}>
                <Form layout="vertical" onFinish={handleFinish} autoComplete="off">
                    <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input placeholder="admin" />
                    </Form.Item>
                    <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password placeholder="********" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        登录
                    </Button>
                </Form>
                <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                    默认账号: admin / macro123
                </Typography.Paragraph>
            </Card>
        </div>
    )
}
