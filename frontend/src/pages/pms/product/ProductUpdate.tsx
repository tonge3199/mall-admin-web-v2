/**
 * Update Product Page (Placeholder)
 * TODO: Implement full product form
 */
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Result, Button } from 'antd'

export function ProductUpdatePage() {
    const [searchParams] = useSearchParams()
    const productId = searchParams.get('id')
    const navigate = useNavigate()

    return (
        <Card>
            <Result
                status="info"
                title={`编辑商品 #${productId}`}
                subTitle="商品编辑表单较为复杂，包含多个标签页：商品信息、促销、属性、关联、SKU等。此功能待完善。"
                extra={
                    <Button type="primary" onClick={() => navigate(-1)}>
                        返回
                    </Button>
                }
            />
        </Card>
    )
}
