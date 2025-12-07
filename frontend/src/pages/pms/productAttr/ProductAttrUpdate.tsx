/**
 * Update Product Attribute Page
 */
import { useSearchParams } from 'react-router-dom'
import { ProductAttrForm } from './ProductAttrForm'

export function ProductAttrUpdatePage() {
    const [searchParams] = useSearchParams()
    const attrId = Number(searchParams.get('id'))

    if (!attrId) {
        return <div>属性ID不存在</div>
    }

    return <ProductAttrForm isEdit attrId={attrId} />
}
