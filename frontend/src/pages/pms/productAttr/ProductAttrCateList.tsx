/**
 * Product Attribute Category List Page (商品类型)
 * Migrated from Vue: src/views/pms/productAttr/index.vue
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, Space, message, Popconfirm, Modal, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnsType } from 'antd/es/table'
import {
    fetchProductAttrCategoryList,
    createProductAttrCategory,
    updateProductAttrCategory,
    deleteProductAttrCategory,
} from '@/api/pms/productAttrCategory'
import type { ProductAttrCategory } from '@/types/pms'

const DEFAULT_PAGE_SIZE = 10

export function ProductAttrCateListPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [query, setQuery] = useState({ pageNum: 1, pageSize: DEFAULT_PAGE_SIZE })
    const [modalOpen, setModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<ProductAttrCategory | null>(null)
    const [form] = Form.useForm()

    // Fetch list
    const { data, isLoading } = useQuery({
        queryKey: ['productAttrCategories', query],
        queryFn: () => fetchProductAttrCategoryList(query),
    })

    // Mutations
    const createMutation = useMutation({
        mutationFn: createProductAttrCategory,
        onSuccess: () => {
            message.success('添加成功')
            queryClient.invalidateQueries({ queryKey: ['productAttrCategories'] })
            setModalOpen(false)
            form.resetFields()
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
            updateProductAttrCategory(id, data),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['productAttrCategories'] })
            setModalOpen(false)
            form.resetFields()
            setEditingItem(null)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProductAttrCategory,
        onSuccess: () => {
            message.success('删除成功')
            queryClient.invalidateQueries({ queryKey: ['productAttrCategories'] })
        },
    })

    const handleAdd = () => {
        setEditingItem(null)
        form.resetFields()
        setModalOpen(true)
    }

    const handleEdit = (record: ProductAttrCategory) => {
        setEditingItem(record)
        form.setFieldsValue({ name: record.name })
        setModalOpen(true)
    }

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            if (editingItem) {
                updateMutation.mutate({ id: editingItem.id!, data: values })
            } else {
                createMutation.mutate(values)
            }
        } catch {
            // validation error
        }
    }

    const columns: ColumnsType<ProductAttrCategory> = [
        { title: '编号', dataIndex: 'id', width: 80, align: 'center' },
        { title: '类型名称', dataIndex: 'name', align: 'center' },
        {
            title: '属性数量',
            width: 120,
            align: 'center',
            render: (_, record) => record.attributeCount ?? 0,
        },
        {
            title: '参数数量',
            width: 120,
            align: 'center',
            render: (_, record) => record.paramCount ?? 0,
        },
        {
            title: '设置',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() =>
                            navigate(`/pms/productAttrList?cid=${record.id}&cname=${record.name}&type=0`)
                        }
                    >
                        属性列表
                    </Button>
                    <Button
                        size="small"
                        onClick={() =>
                            navigate(`/pms/productAttrList?cid=${record.id}&cname=${record.name}&type=1`)
                        }
                    >
                        参数列表
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
                    <Button size="small" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="是否要删除该类型?"
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
                    <span>商品类型列表</span>
                    <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
                        添加
                    </Button>
                </div>

                <Table<ProductAttrCategory>
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
                        onChange: (page, pageSize) => setQuery({ pageNum: page, pageSize }),
                    }}
                    bordered
                    size="small"
                />
            </Card>

            <Modal
                title={editingItem ? '编辑类型' : '添加类型'}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={() => {
                    setModalOpen(false)
                    setEditingItem(null)
                    form.resetFields()
                }}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="类型名称"
                        name="name"
                        rules={[{ required: true, message: '请输入类型名称' }]}
                    >
                        <Input placeholder="请输入类型名称" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
