/**
 * Product Attribute Form Component
 */
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Form, Input, InputNumber, Radio, Button, Space, message, Modal } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductAttribute, updateProductAttribute, getProductAttribute } from '@/api/pms/productAttribute'
import type { ProductAttribute } from '@/types/pms'

interface ProductAttrFormProps {
    isEdit?: boolean
    attrId?: number
}

const defaultAttr: Partial<ProductAttribute> = {
    productAttributeCategoryId: 0,
    name: '',
    selectType: 0,
    inputType: 0,
    inputList: '',
    sort: 0,
    filterType: 0,
    searchType: 0,
    relatedStatus: 0,
    handAddStatus: 0,
    type: 0,
}

export function ProductAttrForm({ isEdit = false, attrId }: ProductAttrFormProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [form] = Form.useForm<ProductAttribute>()
    const [searchParams] = useSearchParams()

    const cid = Number(searchParams.get('cid')) || 0
    const type = (Number(searchParams.get('type')) || 0) as 0 | 1

    // Load attribute data for edit mode
    useEffect(() => {
        if (isEdit && attrId) {
            getProductAttribute(attrId).then((res) => {
                form.setFieldsValue(res.data)
            })
        } else {
            form.setFieldsValue({
                ...defaultAttr,
                productAttributeCategoryId: cid,
                type,
            } as ProductAttribute)
        }
    }, [isEdit, attrId, form, cid, type])

    const createMutation = useMutation({
        mutationFn: createProductAttribute,
        onSuccess: () => {
            message.success('添加成功')
            queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
            navigate(-1)
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: ProductAttribute) => updateProductAttribute(attrId!, data),
        onSuccess: () => {
            message.success('修改成功')
            queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
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

    return (
        <Card className="form-card">
            <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} initialValues={defaultAttr}>
                <Form.Item name="productAttributeCategoryId" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="type" hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="属性名称"
                    name="name"
                    rules={[{ required: true, message: '请输入属性名称' }]}
                >
                    <Input placeholder="请输入属性名称" />
                </Form.Item>

                <Form.Item label="属性是否可选" name="selectType">
                    <Radio.Group>
                        <Radio value={0}>唯一</Radio>
                        <Radio value={1}>单选</Radio>
                        <Radio value={2}>多选</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="属性值录入方式" name="inputType">
                    <Radio.Group>
                        <Radio value={0}>手工录入</Radio>
                        <Radio value={1}>从列表中选取</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="可选值列表"
                    name="inputList"
                    tooltip="多个值用英文逗号分隔"
                >
                    <Input.TextArea rows={3} placeholder="输入多个值用英文逗号分隔，如：红色,蓝色,绿色" />
                </Form.Item>

                <Form.Item label="排序" name="sort">
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item label="分类筛选样式" name="filterType">
                    <Radio.Group>
                        <Radio value={0}>普通</Radio>
                        <Radio value={1}>颜色</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="检索类型" name="searchType">
                    <Radio.Group>
                        <Radio value={0}>不需要检索</Radio>
                        <Radio value={1}>关键字检索</Radio>
                        <Radio value={2}>范围检索</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="相同属性产品是否关联" name="relatedStatus">
                    <Radio.Group>
                        <Radio value={0}>否</Radio>
                        <Radio value={1}>是</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="是否支持手动新增" name="handAddStatus">
                    <Radio.Group>
                        <Radio value={0}>否</Radio>
                        <Radio value={1}>是</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6 }}>
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
