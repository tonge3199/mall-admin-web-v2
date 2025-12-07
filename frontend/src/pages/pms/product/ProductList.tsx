/**
 * Product List Page
 * Migrated from Vue: src/views/pms/product/index.vue
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, Input, Space, Switch, Select, message, Popconfirm, Image, Cascader } from 'antd'
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
    fetchProductList,
    updateProductPublishStatus,
    updateProductNewStatus,
    updateProductRecommendStatus,
    updateProductDeleteStatus,
    type ProductQuery,
} from '@/api/pms/product'
import { fetchBrandList } from '@/api/pms/brand'
import { fetchProductCategoryWithChildren } from '@/api/pms/productCategory'
import type { Product } from '@/types/pms'

const DEFAULT_PAGE_SIZE = 10

const publishStatusOptions = [
    { label: '上架', value: 1 },
    { label: '下架', value: 0 },
]

const verifyStatusOptions = [
    { label: '审核通过', value: 1 },
    { label: '未审核', value: 0 },
]

export function ProductListPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [query, setQuery] = useState<ProductQuery>({
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        keyword: '',
        productSn: '',
        brandId: undefined,
        productCategoryId: undefined,
        publishStatus: undefined,
        verifyStatus: undefined,
    })

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [operateType, setOperateType] = useState<string | null>(null)
    const [selectCateValue, setSelectCateValue] = useState<number[]>([])

    // Fetch product list
    const { data, isLoading } = useQuery({
        queryKey: ['products', query],
        queryFn: () => fetchProductList(query),
    })

    // Fetch brands for filter
    const { data: brandsData } = useQuery({
        queryKey: ['brands', { pageNum: 1, pageSize: 100 }],
        queryFn: () => fetchBrandList({ pageNum: 1, pageSize: 100 }),
    })

    // Fetch categories for filter
    const { data: categoriesData } = useQuery({
        queryKey: ['productCategoriesWithChildren'],
        queryFn: fetchProductCategoryWithChildren,
    })

    // Mutations
    const publishMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateProductPublishStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const newStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateProductNewStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const recommendMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: 0 | 1 }) =>
            updateProductRecommendStatus(ids, status),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (ids: number[]) => updateProductDeleteStatus(ids, 1),
        onSuccess: () => {
            message.success('删除成功')
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })

    // Build category cascade options
    const categoryOptions =
        categoriesData?.data?.map((cat) => ({
            value: cat.id,
            label: cat.name,
            children: cat.children?.map((child) => ({
                value: child.id,
                label: child.name,
            })),
        })) || []

    // Build brand options
    const brandOptions =
        brandsData?.data?.list?.map((b) => ({
            value: b.id,
            label: b.name,
        })) || []

    const handleSearch = () => {
        setQuery((prev) => ({ ...prev, pageNum: 1 }))
    }

    const handleReset = () => {
        setQuery({
            pageNum: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            keyword: '',
            productSn: '',
            brandId: undefined,
            productCategoryId: undefined,
            publishStatus: undefined,
            verifyStatus: undefined,
        })
        setSelectCateValue([])
    }

    const handleCategoryChange = (value: number[]) => {
        setSelectCateValue(value)
        // Use the last selected category ID
        setQuery((prev) => ({
            ...prev,
            productCategoryId: value.length > 0 ? value[value.length - 1] : undefined,
        }))
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
        switch (operateType) {
            case 'publish':
                publishMutation.mutate({ ids: selectedRowKeys, status: 1 })
                break
            case 'unpublish':
                publishMutation.mutate({ ids: selectedRowKeys, status: 0 })
                break
            case 'recommend':
                recommendMutation.mutate({ ids: selectedRowKeys, status: 1 })
                break
            case 'unrecommend':
                recommendMutation.mutate({ ids: selectedRowKeys, status: 0 })
                break
            case 'new':
                newStatusMutation.mutate({ ids: selectedRowKeys, status: 1 })
                break
            case 'unnew':
                newStatusMutation.mutate({ ids: selectedRowKeys, status: 0 })
                break
            case 'delete':
                deleteMutation.mutate(selectedRowKeys)
                break
        }
        setSelectedRowKeys([])
    }

    const columns: ColumnsType<Product> = [
        { title: '编号', dataIndex: 'id', width: 80, align: 'center' },
        {
            title: '商品图片',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Image src={record.pic} width={60} height={60} style={{ objectFit: 'cover' }} />
            ),
        },
        {
            title: '商品名称',
            align: 'center',
            render: (_, record) => (
                <div>
                    <div>{record.name}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>品牌：{record.brandName}</div>
                </div>
            ),
        },
        {
            title: '价格/货号',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <div>
                    <div>价格：￥{record.price}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>货号：{record.productSn}</div>
                </div>
            ),
        },
        {
            title: '标签',
            width: 130,
            align: 'center',
            render: (_, record) => (
                <div style={{ textAlign: 'left' }}>
                    <div>
                        上架：
                        <Switch
                            size="small"
                            checked={record.publishStatus === 1}
                            onChange={(checked) =>
                                publishMutation.mutate({ ids: [record.id!], status: checked ? 1 : 0 })
                            }
                        />
                    </div>
                    <div>
                        新品：
                        <Switch
                            size="small"
                            checked={record.newStatus === 1}
                            onChange={(checked) =>
                                newStatusMutation.mutate({ ids: [record.id!], status: checked ? 1 : 0 })
                            }
                        />
                    </div>
                    <div>
                        推荐：
                        <Switch
                            size="small"
                            checked={record.recommendStatus === 1}
                            onChange={(checked) =>
                                recommendMutation.mutate({ ids: [record.id!], status: checked ? 1 : 0 })
                            }
                        />
                    </div>
                </div>
            ),
        },
        { title: '排序', dataIndex: 'sort', width: 60, align: 'center' },
        { title: '销量', dataIndex: 'sale', width: 60, align: 'center' },
        {
            title: '操作',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Button size="small" onClick={() => navigate(`/pms/product/update?id=${record.id}`)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="是否要删除该商品?"
                        onConfirm={() => deleteMutation.mutate([record.id!])}
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
            {/* Filter Card */}
            <Card className="filter-card" size="small">
                <div className="filter-header">
                    <Space>
                        <SearchOutlined />
                        <span>筛选搜索</span>
                    </Space>
                    <Space>
                        <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
                            重置
                        </Button>
                        <Button type="primary" size="small" onClick={handleSearch}>
                            查询结果
                        </Button>
                    </Space>
                </div>
                <div className="filter-form">
                    <Space wrap>
                        <span>输入搜索：</span>
                        <Input
                            placeholder="商品名称"
                            value={query.keyword}
                            onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
                            style={{ width: 150 }}
                        />
                        <span>商品货号：</span>
                        <Input
                            placeholder="商品货号"
                            value={query.productSn}
                            onChange={(e) => setQuery((prev) => ({ ...prev, productSn: e.target.value }))}
                            style={{ width: 150 }}
                        />
                        <span>商品分类：</span>
                        <Cascader
                            options={categoryOptions}
                            value={selectCateValue}
                            onChange={(value) => handleCategoryChange(value as number[])}
                            placeholder="请选择"
                            allowClear
                            style={{ width: 200 }}
                        />
                        <span>商品品牌：</span>
                        <Select
                            placeholder="请选择品牌"
                            value={query.brandId}
                            onChange={(value) => setQuery((prev) => ({ ...prev, brandId: value }))}
                            options={brandOptions}
                            allowClear
                            style={{ width: 150 }}
                        />
                        <span>上架状态：</span>
                        <Select
                            placeholder="全部"
                            value={query.publishStatus}
                            onChange={(value) => setQuery((prev) => ({ ...prev, publishStatus: value }))}
                            options={publishStatusOptions}
                            allowClear
                            style={{ width: 100 }}
                        />
                        <span>审核状态：</span>
                        <Select
                            placeholder="全部"
                            value={query.verifyStatus}
                            onChange={(value) => setQuery((prev) => ({ ...prev, verifyStatus: value }))}
                            options={verifyStatusOptions}
                            allowClear
                            style={{ width: 100 }}
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
                        onClick={() => navigate('/pms/product/add')}
                    >
                        添加
                    </Button>
                </div>

                <Table<Product>
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
                        onChange: (page, pageSize) =>
                            setQuery((prev) => ({ ...prev, pageNum: page, pageSize })),
                    }}
                    bordered
                    size="small"
                />

                <div className="batch-operate">
                    <Select
                        placeholder="批量操作"
                        value={operateType}
                        onChange={setOperateType}
                        style={{ width: 150 }}
                        allowClear
                        options={[
                            { label: '上架', value: 'publish' },
                            { label: '下架', value: 'unpublish' },
                            { label: '设为推荐', value: 'recommend' },
                            { label: '取消推荐', value: 'unrecommend' },
                            { label: '设为新品', value: 'new' },
                            { label: '取消新品', value: 'unnew' },
                            { label: '删除', value: 'delete' },
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
