/**
 * Brand List Page
 * Migrated from Vue: src/views/pms/brand/index.vue
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, Input, Space, Switch, message, Popconfirm, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
    fetchBrandList,
    updateBrandShowStatus,
    updateBrandFactoryStatus,
    deleteBrand,
    type BrandQuery,
} from '@/api/pms/brand'
import type { Brand } from '@/types/pms'

const DEFAULT_PAGE_SIZE = 10

export function BrandListPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Query state
    const [query, setQuery] = useState<BrandQuery>({
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        keyword: '',
    })

    // Selection state for batch operations
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [operateType, setOperateType] = useState<string | null>(null)

    // Fetch brand list
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['brands', query],
        queryFn: () => fetchBrandList(query),
    })

    // Mutations
    const showStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateBrandShowStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['brands'] })
        },
    })

    const factoryStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateBrandFactoryStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['brands'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            message.success('删除成功')
            queryClient.invalidateQueries({ queryKey: ['brands'] })
        },
    })

    // Handlers
    const handleSearch = () => {
        setQuery((prev) => ({ ...prev, pageNum: 1 }))
        refetch()
    }

    const handleShowStatusChange = (record: Brand, checked: boolean) => {
        showStatusMutation.mutate({
            ids: [record.id!],
            status: checked ? 1 : 0,
        })
    }

    const handleFactoryStatusChange = (record: Brand, checked: boolean) => {
        factoryStatusMutation.mutate({
            ids: [record.id!],
            status: checked ? 1 : 0,
        })
    }

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id)
    }

    const handleBatchOperate = () => {
        if (selectedRowKeys.length < 1) {
            message.warning('请选择一条记录')
            return
        }
        if (!operateType) {
            message.warning('请选择批量操作类型')
            return
        }
        const showStatus = operateType === 'showBrand' ? 1 : 0
        showStatusMutation.mutate({ ids: selectedRowKeys, status: showStatus as 0 | 1 })
        setSelectedRowKeys([])
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setQuery((prev) => ({ ...prev, pageNum: page, pageSize }))
    }

    // Table columns
    const columns: ColumnsType<Brand> = [
        {
            title: '编号',
            dataIndex: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: '品牌名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '品牌首字母',
            dataIndex: 'firstLetter',
            width: 100,
            align: 'center',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            width: 80,
            align: 'center',
        },
        {
            title: '品牌制造商',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={record.factoryStatus === 1}
                    onChange={(checked) => handleFactoryStatusChange(record, checked)}
                />
            ),
        },
        {
            title: '是否显示',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Switch
                    checked={record.showStatus === 1}
                    onChange={(checked) => handleShowStatusChange(record, checked)}
                />
            ),
        },
        {
            title: '相关',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <span>商品：</span>
                    <Button type="link" size="small">
                        {record.productCount ?? 0}
                    </Button>
                    <span>评价：</span>
                    <Button type="link" size="small">
                        {record.productCommentCount ?? 0}
                    </Button>
                </Space>
            ),
        },
        {
            title: '操作',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button size="small" onClick={() => navigate(`/pms/brand/update?id=${record.id}`)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="是否要删除该品牌?"
                        onConfirm={() => handleDelete(record.id!)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button size="small" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div className="page-container">
            {/* Filter Card */}
            <Card className="filter-card" size="small">
                <div className="filter-header">
                    <Space>
                        <SearchOutlined />
                        <span>筛选搜索</span>
                    </Space>
                    <Button type="primary" size="small" onClick={handleSearch}>
                        查询结果
                    </Button>
                </div>
                <div className="filter-form">
                    <Space>
                        <span>输入搜索：</span>
                        <Input
                            placeholder="品牌名称/关键字"
                            value={query.keyword}
                            onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
                            style={{ width: 200 }}
                            onPressEnter={handleSearch}
                        />
                    </Space>
                </div>
            </Card>

            {/* Data List Card */}
            <Card className="table-card" size="small">
                <div className="table-header">
                    <span>数据列表</span>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/pms/brand/add')}
                    >
                        添加
                    </Button>
                </div>

                <Table<Brand>
                    rowKey="id"
                    columns={columns}
                    dataSource={data?.data?.list || []}
                    loading={isLoading}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys) => setSelectedRowKeys(keys as number[]),
                    }}
                    pagination={{
                        current: query.pageNum,
                        pageSize: query.pageSize,
                        total: data?.data?.total || 0,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`,
                        pageSizeOptions: ['5', '10', '15'],
                        onChange: handlePageChange,
                    }}
                    bordered
                    size="small"
                />

                {/* Batch Operations */}
                <div className="batch-operate">
                    <Select
                        placeholder="批量操作"
                        value={operateType}
                        onChange={setOperateType}
                        style={{ width: 120 }}
                        allowClear
                        options={[
                            { label: '显示品牌', value: 'showBrand' },
                            { label: '隐藏品牌', value: 'hideBrand' },
                        ]}
                    />
                    <Button type="primary" size="small" onClick={handleBatchOperate}>
                        确定
                    </Button>
                </div>
            </Card>
        </div>
    )
}
