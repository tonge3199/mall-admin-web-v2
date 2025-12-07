/**
 * Update Brand Page
 * Migrated from Vue: src/views/pms/brand/update.vue
 */
import { useSearchParams } from 'react-router-dom'
import { BrandForm } from './BrandForm'

export function BrandUpdatePage() {
    const [searchParams] = useSearchParams()
    const brandId = Number(searchParams.get('id'))

    if (!brandId) {
        return <div>品牌ID不存在</div>
    }

    return <BrandForm isEdit brandId={brandId} />
}
