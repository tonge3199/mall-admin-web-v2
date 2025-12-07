/**
 * Product Attribute API
 * Migrated from Vue: src/api/productAttr.js
 */
import { api } from '@/api/client'
import type { PageResult, PageQuery } from '@/api/types'
import type { ProductAttribute } from '@/types/pms'

const BASE_URL = '/productAttribute'

/** Get attribute list by category id */
export function fetchProductAttributeList(categoryId: number, params: PageQuery & { type?: 0 | 1 }) {
    return api.get<any, { data: PageResult<ProductAttribute> }>(`${BASE_URL}/list/${categoryId}`, { params })
}

/** Delete product attributes (batch) */
export function deleteProductAttribute(ids: number[]) {
    return api.post(`${BASE_URL}/delete`, ids)
}

/** Create product attribute */
export function createProductAttribute(data: ProductAttribute) {
    return api.post<any, { data: number }>(`${BASE_URL}/create`, data)
}

/** Update product attribute by id */
export function updateProductAttribute(id: number, data: ProductAttribute) {
    return api.post<any, { data: number }>(`${BASE_URL}/update/${id}`, data)
}

/** Get product attribute by id */
export function getProductAttribute(id: number) {
    return api.get<any, { data: ProductAttribute }>(`${BASE_URL}/${id}`)
}

/** Get attribute info for product category (for product creation) */
export function getProductAttrInfo(productCategoryId: number) {
    return api.get<any, { data: { attributeList: ProductAttribute[]; attributeCategoryId: number } }>(
        `${BASE_URL}/attrInfo/${productCategoryId}`
    )
}
