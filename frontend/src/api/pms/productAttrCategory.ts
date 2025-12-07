/**
 * Product Attribute Category API
 * Migrated from Vue: src/api/productAttrCate.js
 */
import { api } from '@/api/client'
import type { PageResult, PageQuery } from '@/api/types'
import type { ProductAttrCategory } from '@/types/pms'

const BASE_URL = '/productAttribute/category'

/** Get attribute category list */
export function fetchProductAttrCategoryList(params: PageQuery) {
    return api.get<any, { data: PageResult<ProductAttrCategory> }>(`${BASE_URL}/list`, { params })
}

/** Create attribute category */
export function createProductAttrCategory(data: Pick<ProductAttrCategory, 'name'>) {
    return api.post<any, { data: number }>(`${BASE_URL}/create`, data)
}

/** Delete attribute category by id */
export function deleteProductAttrCategory(id: number) {
    return api.get(`${BASE_URL}/delete/${id}`)
}

/** Update attribute category by id */
export function updateProductAttrCategory(id: number, data: Pick<ProductAttrCategory, 'name'>) {
    return api.post<any, { data: number }>(`${BASE_URL}/update/${id}`, data)
}

/** Get all attribute categories with their attributes */
export function fetchProductAttrCategoryWithAttr() {
    return api.get<any, { data: ProductAttrCategory[] }>(`${BASE_URL}/list/withAttr`)
}
