/**
 * Product Category Form Component
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, InputNumber, Radio, Select, Button, Space, message, Modal } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createProductCategory,
    updateProductCategory,
    getProductCategory,
    fetchProductCategoryWithChildren,
} from '@/api/pms/productCategory'
import type { ProductCategory } from '@/types/pms'

interface ProductCateFormProps {
    isEdit?: boolean
    categoryId?: number
}

const defaultCategory: Partial<ProductCategory> = {
    parentId: 0,
    name: '',
    level: 0,
    productUnit: '',
    navStatus: 0,
    showStatus: 1,
    sort: 0,
    icon: '',
    keywords: '',
    description: '',
}

export function ProductCateForm({ isEdit = false, categoryId }: ProductCateFormProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [form] = Form.useForm<ProductCategory>()
    const [parentLevel, setParentLevel] = useState(0)

    // Load all categories for parent selection
    const { data: categoriesData } = useQuery({
        queryKey: ['productCategoriesWithChildren'],
        queryFn: fetchProductCategoryWithChildren,
    })

    // Load category data for edit mode
    useEffect(() => {
        if (isEdit && categoryId) {
            getProductCategory(categoryId).then((res) => {
                form.setFieldsValue(res.data)
                // Find parent level
                const parent = categoriesData?.data?.find((c) => c.id === res.data.parentId)
                setParentLevel(parent ? parent.level + 1 : res.data.level)
            })
        } else {
            form.setFieldsValue(defaultCategory as ProductCategory)
        }
    }, [isEdit, categoryId, form, categoriesData])

    const createMutation = useMutation({
        mutationFn: createProductCategory,
        onSuccess: () => {
            message.success('添加成功')
            queryClient.invalidateQueries({ queryKey: ['productCategories'] })
            navigate(-1)
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: ProductCategory) => updateProductCategory(categoryId!, data),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['productCategories'] })
            navigate(-1)
        },
    })

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            Modal.confirm({
                title: '提示',
                content: '是否提交数据',
                onOk: () => {
                    if (isEdit) {
                        updateMutation.mutate(values)
                    } else {
                        createMutation.mutate(values)
                    }
                },
            })
        } catch {
            message.error('验证失败')
        }
    }

    const handleParentChange = (parentId: number) => {
        if (parentId === 0) {
            setParentLevel(0)
            form.setFieldValue('level', 0)
        } else {
            const parent = categoriesData?.data?.find((c) => c.id === parentId)
            if (parent) {
                setParentLevel(parent.level + 1)
                form.setFieldValue('level', parent.level + 1)
            }
        }
    }

    // Build parent options (only level 0 categories can be parents)
    const parentOptions = [
        { label: '无上级分类', value: 0 },
        ...(categoriesData?.data?.filter((c) => c.level === 0).map((c) => ({
            label: c.name,
            value: c.id!,
        })) || []),
    ]

    return (
        <Card className="form-card">
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={defaultCategory}>
                <Form.Item
                    label="分类名称"
                    name="name"
                    rules={[{ required: true, message: '请输入分类名称' }]}
                >
                    <Input placeholder="请输入分类名称" />
                </Form.Item>

                <Form.Item label="上级分类" name="parentId">
                    <Select options={parentOptions} onChange={handleParentChange} />
                </Form.Item>

                <Form.Item label="分类级别" name="level">
                    <Input value={parentLevel === 0 ? '一级分类' : '二级分类'} disabled />
                </Form.Item>

                <Form.Item label="数量单位" name="productUnit">
                    <Input placeholder="如：件、台" style={{ width: 150 }} />
                </Form.Item>

                <Form.Item label="排序" name="sort">
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="是否显示" name="showStatus">
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="导航栏显示" name="navStatus">
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="分类图标" name="icon">
                    <Input placeholder="分类图标URL" />
                </Form.Item>

                <Form.Item label="关键词" name="keywords">
                    <Input placeholder="关键词" />
                </Form.Item>

                <Form.Item label="分类描述" name="description">
                    <Input.TextArea rows={3} placeholder="分类描述" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4 }}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            提交
                        </Button>
                        <Button onClick={() => navigate(-1)}>返回</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}
