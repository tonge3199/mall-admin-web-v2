/**
 * Product Attribute List Page (属性/参数列表)
 * Migrated from Vue: src/views/pms/productAttr/productAttrList.vue
 */
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Table, Button, Space, message, Popconfirm, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import { fetchProductAttributeList, deleteProductAttribute } from '@/api/pms/productAttribute'
import type { ProductAttribute } from '@/types/pms'

const DEFAULT_PAGE_SIZE = 10

const selectTypeMap: Record<number, string> = {
    0: '唯一',
    1: '单选',
    2: '多选',
}

const inputTypeMap: Record<number, string> = {
    0: '手工录入',
    1: '从列表中选取',
}

export function ProductAttrListPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()

    const cid = Number(searchParams.get('cid')) || 0
    const cname = searchParams.get('cname') || ''
    const type = (Number(searchParams.get('type')) || 0) as 0 | 1 // 0=规格, 1=参数

    const [query, setQuery] = useState({ pageNum: 1, pageSize: DEFAULT_PAGE_SIZE, type })
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [operateType, setOperateType] = useState<string | null>(null)

    // Fetch list
    const { data, isLoading } = useQuery({
        queryKey: ['productAttributes', cid, query],
        queryFn: () => fetchProductAttributeList(cid, query),
        enabled: cid > 0,
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteProductAttribute,
        onSuccess: () => {
            message.success('删除成功')
            queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
            setSelectedRowKeys([])
        },
    })

    const handleDelete = (ids: number[]) => {
        deleteMutation.mutate(ids)
    }

    const handleBatchOperate = () => {
        if (selectedRowKeys.length < 1) {
            message.warning('请选择一条记录')
            return
        }
        if (operateType !== 'delete') {
            message.warning('请选择批量操作类型')
            return
        }
        handleDelete(selectedRowKeys)
    }

    const columns: ColumnsType<ProductAttribute> = [
        { title: '编号', dataIndex: 'id', width: 80, align: 'center' },
        { title: '属性名称', dataIndex: 'name', width: 140, align: 'center' },
        { title: '商品类型', width: 140, align: 'center', render: () => cname },
        {
            title: '属性是否可选',
            width: 120,
            align: 'center',
            render: (_, record) => selectTypeMap[record.selectType] || record.selectType,
        },
        {
            title: '属性值的录入方式',
            width: 150,
            align: 'center',
            render: (_, record) => inputTypeMap[record.inputType] || record.inputType,
        },
        { title: '可选值列表', dataIndex: 'inputList', align: 'center' },
        { title: '排序', dataIndex: 'sort', width: 80, align: 'center' },
        {
            title: '操作',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() => navigate(`/pms/productAttr/update?id=${record.id}`)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="是否要删除该属性?"
                        onConfirm={() => handleDelete([record.id!])}
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
                        {type === 0 ? '属性列表' : '参数列表'} - {cname}
                        <Button type="link" onClick={() => navigate('/pms/productAttr')}>
                            返回
                        </Button>
                    </span>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => navigate(`/pms/productAttr/add?cid=${cid}&type=${type}`)}
                    >
                        添加
                    </Button>
                </div>

                <Table<ProductAttribute>
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
                        onChange: (page, pageSize) => setQuery((q) => ({ ...q, pageNum: page, pageSize })),
                    }}
                    bordered
                    size="small"
                />

                <div className="batch-operate">
                    <Select
                        placeholder="批量操作"
                        value={operateType}
                        onChange={setOperateType}
                        style={{ width: 120 }}
                        allowClear
                        options={[{ label: '删除', value: 'delete' }]}
                    />
                    <Button type="primary" size="small" onClick={handleBatchOperate}>
                        确定
                    </Button>
                </div>
            </Card>
        </div>
    )
}
