import { Layout as AntLayout, Menu } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import type { MenuProps } from 'antd'
import {
    HomeOutlined,
    ShopOutlined,
    OrderedListOutlined,
    GiftOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = AntLayout

type MenuItem = Required<MenuProps>['items'][number]

/**
 * Menu configuration matching old Vue project router structure
 * Reference: OldRepo/mall-admin-web/src/router/index.js
 */
const menuItems: MenuItem[] = [
    {
        key: '/home',
        label: '首页',
        icon: <HomeOutlined />,
    },
    {
        key: '/pms',
        label: '商品',
        icon: <ShopOutlined />,
        children: [
            { key: '/pms/product', label: '商品列表' },
            { key: '/pms/product/add', label: '添加商品' },
            { key: '/pms/productCate', label: '商品分类' },
            { key: '/pms/productAttr', label: '商品类型' },
            { key: '/pms/brand', label: '品牌管理' },
        ],
    },
    {
        key: '/oms',
        label: '订单',
        icon: <OrderedListOutlined />,
        children: [
            { key: '/oms/order', label: '订单列表' },
            { key: '/oms/orderSetting', label: '订单设置' },
            { key: '/oms/returnApply', label: '退货申请处理' },
            { key: '/oms/returnReason', label: '退货原因设置' },
        ],
    },
    {
        key: '/sms',
        label: '营销',
        icon: <GiftOutlined />,
        children: [
            { key: '/sms/flash', label: '秒杀活动列表' },
            { key: '/sms/coupon', label: '优惠券列表' },
            { key: '/sms/brand', label: '品牌推荐' },
            { key: '/sms/new', label: '新品推荐' },
            { key: '/sms/hot', label: '人气推荐' },
            { key: '/sms/subject', label: '专题推荐' },
            { key: '/sms/advertise', label: '广告列表' },
        ],
    },
]

/** Get all parent keys for a path to handle default open submenus */
function getOpenKeys(pathname: string): string[] {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length > 1) {
        return [`/${parts[0]}`]
    }
    return []
}

export function Layout() {
    const location = useLocation()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    const selectedKeys = useMemo(() => {
        return [location.pathname]
    }, [location.pathname])

    const defaultOpenKeys = useMemo(() => {
        return getOpenKeys(location.pathname)
    }, [location.pathname])

    const handleMenuClick: MenuProps['onClick'] = (info) => {
        navigate(info.key)
    }

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider
                width={220}
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
            >
                <div className="app-logo">
                    {collapsed ? 'MA' : 'Mall Admin'}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={selectedKeys}
                    defaultOpenKeys={defaultOpenKeys}
                    items={menuItems}
                    onClick={handleMenuClick}
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
