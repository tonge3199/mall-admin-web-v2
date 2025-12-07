/**
 * Product Category Management API
 * Migrated from Vue: src/api/productCate.js
 */
import { api } from '@/api/client'
import type { PageResult, PageQuery } from '@/api/types'
import type { ProductCategory } from '@/types/pms'

const BASE_URL = '/productCategory'

/** Get product category list by parent id */
export function fetchProductCategoryList(parentId: number, params: PageQuery) {
    return api.get<any, { data: PageResult<ProductCategory> }>(`${BASE_URL}/list/${parentId}`, { params })
}

/** Delete a product category by id */
export function deleteProductCategory(id: number) {
    return api.post(`${BASE_URL}/delete/${id}`)
}

/** Create a new product category */
export function createProductCategory(data: ProductCategory) {
    return api.post<any, { data: number }>(`${BASE_URL}/create`, data)
}

/** Update a product category by id */
export function updateProductCategory(id: number, data: ProductCategory) {
    return api.post<any, { data: number }>(`${BASE_URL}/update/${id}`, data)
}

/** Get product category by id */
export function getProductCategory(id: number) {
    return api.get<any, { data: ProductCategory }>(`${BASE_URL}/${id}`)
}

/** Update show status */
export function updateProductCategoryShowStatus(ids: number[], showStatus: 0 | 1) {
    const data = new URLSearchParams()
    data.append('ids', ids.join(','))
    data.append('showStatus', String(showStatus))
    return api.post(`${BASE_URL}/update/showStatus`, data)
}

/** Update nav status */
export function updateProductCategoryNavStatus(ids: number[], navStatus: 0 | 1) {
    const data = new URLSearchParams()
    data.append('ids', ids.join(','))
    data.append('navStatus', String(navStatus))
    return api.post(`${BASE_URL}/update/navStatus`, data)
}

/** Get all categories with children */
export function fetchProductCategoryWithChildren() {
    return api.get<any, { data: ProductCategory[] }>(`${BASE_URL}/list/withChildren`)
}
