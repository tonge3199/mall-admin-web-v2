/**
 * Add Product Page (Placeholder)
 * TODO: Implement full product form - this is complex with many tabs
 */
import { Card, Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ProductAddPage() {
    const navigate = useNavigate()

    return (
        <Card>
            <Result
                status="info"
                title="添加商品"
                subTitle="商品添加表单较为复杂，包含多个标签页：商品信息、促销、属性、关联、SKU等。此功能待完善。"
                extra={
                    <Button type="primary" onClick={() => navigate(-1)}>
                        返回
                    </Button>
                }
            />
        </Card>
    )
}
