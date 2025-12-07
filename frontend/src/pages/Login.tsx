import { Button, Card, Form, Input, Typography } from 'antd'
import { api } from '@/api/client'
import { useAuthStore } from '@/auth/store'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export function LoginPage() {
    const setToken = useAuthStore((state) => state.setToken)
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    const handleFinish = async (values: { username: string; password: string; verifyCode?: string }) => {
        setLoading(true)
        try {
            type LoginResponse = { tokenHead?: string; token?: string }
            const res = (await api.post<LoginResponse>('/sso/login', values)) as LoginResponse
            const token = `${res.tokenHead ?? ''}${res.token ?? ''}` || res.token || ''
            setToken(token)
            const redirectTo = (location.state as any)?.from?.pathname || '/home'
            navigate(redirectTo, { replace: true })
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
                    <Form.Item name="verifyCode" label="验证码" rules={[{ required: false }]}>
                        <Input placeholder="可选" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        登录
                    </Button>
                </Form>
                <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                    登录成功后将携带 Authorization: Bearer &lt;token&gt; 调用后端。
                </Typography.Paragraph>
            </Card>
        </div>
    )
}
