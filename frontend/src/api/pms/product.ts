/**
 * Product Management API
 * Migrated from Vue: src/api/product.js
 */
import { api } from '@/api/client'
import type { PageResult, PageQuery } from '@/api/types'
import type { Product } from '@/types/pms'

export interface ProductQuery extends PageQuery {
    keyword?: string
    publishStatus?: 0 | 1
    verifyStatus?: 0 | 1
    productSn?: string
    productCategoryId?: number
    brandId?: number
}

const BASE_URL = '/product'

/** Get product list with pagination */
export function fetchProductList(params: ProductQuery) {
    return api.get<any, { data: PageResult<Product> }>(`${BASE_URL}/list`, { params })
}

/** Get simple product list (for selection) */
export function fetchSimpleProductList(params: ProductQuery) {
    return api.get<any, { data: Product[] }>(`${BASE_URL}/simpleList`, { params })
}

/** Update delete status (soft delete) */
export function updateProductDeleteStatus(ids: number[], deleteStatus: 0 | 1) {
    return api.post(`${BASE_URL}/update/deleteStatus`, null, {
        params: { ids: ids.join(','), deleteStatus },
    })
}

/** Update new product status */
export function updateProductNewStatus(ids: number[], newStatus: 0 | 1) {
    return api.post(`${BASE_URL}/update/newStatus`, null, {
        params: { ids: ids.join(','), newStatus },
    })
}

/** Update recommend status */
export function updateProductRecommendStatus(ids: number[], recommendStatus: 0 | 1) {
    return api.post(`${BASE_URL}/update/recommendStatus`, null, {
        params: { ids: ids.join(','), recommendStatus },
    })
}

/** Update publish status */
export function updateProductPublishStatus(ids: number[], publishStatus: 0 | 1) {
    return api.post(`${BASE_URL}/update/publishStatus`, null, {
        params: { ids: ids.join(','), publishStatus },
    })
}

/** Create product */
export function createProduct(data: Product) {
    return api.post<any, { data: number }>(`${BASE_URL}/create`, data)
}

/** Update product */
export function updateProduct(id: number, data: Product) {
    return api.post<any, { data: number }>(`${BASE_URL}/update/${id}`, data)
}

/** Get product detail for update */
export function getProduct(id: number) {
    return api.get<any, { data: Product }>(`${BASE_URL}/updateInfo/${id}`)
}
