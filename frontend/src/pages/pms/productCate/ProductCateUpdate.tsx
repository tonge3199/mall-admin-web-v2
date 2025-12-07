/**
 * Update Product Category Page
 */
import { useSearchParams } from 'react-router-dom'
import { ProductCateForm } from './ProductCateForm'

export function ProductCateUpdatePage() {
    const [searchParams] = useSearchParams()
    const categoryId = Number(searchParams.get('id'))

    if (!categoryId) {
        return <div>分类ID不存在</div>
    }

    return <ProductCateForm isEdit categoryId={categoryId} />
}
