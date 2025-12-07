/**
 * Brand Form Component
 * Migrated from Vue: src/views/pms/brand/components/BrandDetail.vue
 * Reusable form for both Add and Edit brand pages
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Radio, InputNumber, Button, Space, message, Modal } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBrand, updateBrand, getBrand } from '@/api/pms/brand'
import type { Brand } from '@/types/pms'

const { TextArea } = Input

interface BrandFormProps {
    isEdit?: boolean
    brandId?: number
}

const defaultBrand: Partial<Brand> = {
    bigPic: '',
    brandStory: '',
    factoryStatus: 0,
    firstLetter: '',
    logo: '',
    name: '',
    showStatus: 0,
    sort: 0,
}

export function BrandForm({ isEdit = false, brandId }: BrandFormProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [form] = Form.useForm<Brand>()

    // Load brand data for edit mode
    useEffect(() => {
        if (isEdit && brandId) {
            getBrand(brandId).then((res) => {
                form.setFieldsValue(res.data)
            })
        } else {
            form.setFieldsValue(defaultBrand as Brand)
        }
    }, [isEdit, brandId, form])

    // Create mutation
    const createMutation = useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            message.success('提交成功')
            form.resetFields()
            form.setFieldsValue(defaultBrand as Brand)
        },
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: Brand) => updateBrand(brandId!, data),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['brands'] })
            navigate(-1)
        },
    })

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            Modal.confirm({
                title: '提示',
                content: '是否提交数据',
                okText: '确定',
                cancelText: '取消',
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

    const handleReset = () => {
        form.resetFields()
        form.setFieldsValue(defaultBrand as Brand)
    }

    return (
        <Card className="form-card">
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={defaultBrand}
            >
                <Form.Item
                    label="品牌名称"
                    name="name"
                    rules={[
                        { required: true, message: '请输入品牌名称' },
                        { min: 2, max: 140, message: '长度在 2 到 140 个字符' },
                    ]}
                >
                    <Input placeholder="请输入品牌名称" />
                </Form.Item>

                <Form.Item label="品牌首字母" name="firstLetter">
                    <Input placeholder="请输入品牌首字母" maxLength={1} style={{ width: 100 }} />
                </Form.Item>

                <Form.Item
                    label="品牌LOGO"
                    name="logo"
                    rules={[{ required: true, message: '请输入品牌logo' }]}
                >
                    <Input placeholder="请输入品牌Logo URL" />
                    {/* TODO: Replace with SingleUpload component */}
                </Form.Item>

                <Form.Item label="品牌专区大图" name="bigPic">
                    <Input placeholder="请输入品牌专区大图 URL" />
                    {/* TODO: Replace with SingleUpload component */}
                </Form.Item>

                <Form.Item label="品牌故事" name="brandStory">
                    <TextArea placeholder="请输入品牌故事" autoSize={{ minRows: 3 }} />
                </Form.Item>

                <Form.Item
                    label="排序"
                    name="sort"
                    rules={[{ type: 'number', message: '排序必须为数字' }]}
                >
                    <InputNumber min={0} style={{ width: 150 }} />
                </Form.Item>

                <Form.Item label="是否显示" name="showStatus">
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="品牌制造商" name="factoryStatus">
                    <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
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
                        {!isEdit && (
                            <Button onClick={handleReset}>
                                重置
                            </Button>
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}
