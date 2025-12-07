/**
 * Product Category List Page
 * Migrated from Vue: src/views/pms/productCate/index.vue
 */
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Table, Button, Space, Switch, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
    fetchProductCategoryList,
    deleteProductCategory,
    updateProductCategoryShowStatus,
    updateProductCategoryNavStatus,
} from '@/api/pms/productCategory'
import type { ProductCategory } from '@/types/pms'

const DEFAULT_PAGE_SIZE = 10

const levelMap: Record<number, string> = {
    0: '一级',
    1: '二级',
}

export function ProductCategoryListPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()
    const parentId = Number(searchParams.get('parentId')) || 0

    const [query, setQuery] = useState({
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
    })

    // Fetch category list
    const { data, isLoading } = useQuery({
        queryKey: ['productCategories', parentId, query],
        queryFn: () => fetchProductCategoryList(parentId, query),
    })

    // Mutations
    const showStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateProductCategoryShowStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['productCategories'] })
        },
    })

    const navStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateProductCategoryNavStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['productCategories'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProductCategory,
        onSuccess: () => {
            message.success('删除成功')
            queryClient.invalidateQueries({ queryKey: ['productCategories'] })
        },
    })

    const handlePageChange = (page: number, pageSize: number) => {
        setQuery({ pageNum: page, pageSize })
    }

    const columns: ColumnsType<ProductCategory> = [
        { title: '编号', dataIndex: 'id', width: 80, align: 'center' },
        { title: '分类名称', dataIndex: 'name', align: 'center' },
        {
            title: '级别',
            width: 80,
            align: 'center',
            render: (_, record) => levelMap[record.level] || `${record.level}级`,
        },
        { title: '商品数量', dataIndex: 'productCount', width: 100, align: 'center' },
        { title: '数量单位', dataIndex: 'productUnit', width: 100, align: 'center' },
        {
            title: '导航栏',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={record.navStatus === 1}
                    onChange={(checked) =>
                        navStatusMutation.mutate({ ids: [record.id!], status: checked ? 1 : 0 })
                    }
                />
            ),
        },
        {
            title: '是否显示',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={record.showStatus === 1}
                    onChange={(checked) =>
                        showStatusMutation.mutate({ ids: [record.id!], status: checked ? 1 : 0 })
                    }
                />
            ),
        },
        { title: '排序', dataIndex: 'sort', width: 80, align: 'center' },
        {
            title: '设置',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Button
                    size="small"
                    disabled={record.level >= 1}
                    onClick={() => navigate(`/pms/productCate?parentId=${record.id}`)}
                >
                    查看下级
                </Button>
            ),
        },
        {
            title: '操作',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button size="small" onClick={() => navigate(`/pms/productCate/update?id=${record.id}`)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="是否要删除该分类?"
                        onConfirm={() => deleteMutation.mutate(record.id!)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div className="page-container">
            <Card className="table-card" size="small">
                <div className="table-header">
                    <span>
                        商品分类 {parentId > 0 && (
                            <Button type="link" onClick={() => navigate('/pms/productCate')}>
                                返回上级
                            </Button>
                        )}
                    </span>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/pms/productCate/add')}
                    >
                        添加
                    </Button>
                </div>

                <Table<ProductCategory>
                    rowKey="id"
                    columns={columns}
                    dataSource={data?.data?.list || []}
                    loading={isLoading}
                    pagination={{
                        current: query.pageNum,
                        pageSize: query.pageSize,
                        total: data?.data?.total || 0,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`,
                        onChange: handlePageChange,
                    }}
                    bordered
                    size="small"
                />
            </Card>
        </div>
    )
}
