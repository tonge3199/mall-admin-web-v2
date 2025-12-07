/**
 * Brand Management API
 * Migrated from Vue: src/api/brand.js
 */
import { api } from '@/api/client'
import type { PageResult, PageQuery } from '@/api/types'
import type { Brand } from '@/types/pms'

export interface BrandQuery extends PageQuery {
    keyword?: string
}

const BASE_URL = '/brand'

/** Get brand list with pagination */
export function fetchBrandList(params: BrandQuery) {
    return api.get<any, { data: PageResult<Brand> }>(`${BASE_URL}/list`, { params })
}

/** Create a new brand */
export function createBrand(data: Brand) {
    return api.post<any, { data: number }>(`${BASE_URL}/create`, data)
}

/** Update show status for brands */
export function updateBrandShowStatus(ids: number[], showStatus: 0 | 1) {
    const data = new URLSearchParams()
    data.append('ids', ids.join(','))
    data.append('showStatus', String(showStatus))
    return api.post(`${BASE_URL}/update/showStatus`, data)
}

/** Update factory status for brands */
export function updateBrandFactoryStatus(ids: number[], factoryStatus: 0 | 1) {
    const data = new URLSearchParams()
    data.append('ids', ids.join(','))
    data.append('factoryStatus', String(factoryStatus))
    return api.post(`${BASE_URL}/update/factoryStatus`, data)
}

/** Delete a brand by id */
export function deleteBrand(id: number) {
    return api.get(`${BASE_URL}/delete/${id}`)
}

/** Get brand by id */
export function getBrand(id: number) {
    return api.get<any, { data: Brand }>(`${BASE_URL}/${id}`)
}

/** Update brand by id */
export function updateBrand(id: number, data: Brand) {
    return api.post<any, { data: number }>(`${BASE_URL}/update/${id}`, data)
}
