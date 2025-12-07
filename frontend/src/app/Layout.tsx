import { Layout as AntLayout, Menu } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

const { Header, Sider, Content } = AntLayout

const menuItems = [
    { key: '/home', label: '首页' },
    { key: '/pms', label: '商品' },
    { key: '/oms', label: '订单' },
    { key: '/sms', label: '营销' },
]

export function Layout() {
    const location = useLocation()
    const navigate = useNavigate()

    const selectedKeys = useMemo(() => {
        const hit = menuItems.find((item) => location.pathname.startsWith(item.key))
        return hit ? [hit.key] : []
    }, [location.pathname])

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider width={220} theme="light">
                <div className="app-logo">Mall Admin</div>
                <Menu
                    mode="inline"
                    selectedKeys={selectedKeys}
                    items={menuItems}
                    onClick={(info) => navigate(info.key)}
                />
            </Sider>
            <AntLayout>
                <Header className="app-header">管理后台</Header>
                <Content className="app-content">
                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    )
}
