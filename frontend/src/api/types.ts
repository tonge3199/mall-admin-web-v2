/**
 * Common API Types
 * Base types for API responses following backend structure
 */

/** Standard API Response wrapper */
export interface CommonResult<T> {
    code: number // 200 = Success, 401 = Unauthorized, 404/500 = Error
    message: string
    data: T
}

/** Paginated list result */
export interface PageResult<T> {
    list: T[]
    total: number
    totalPage: number
    pageSize: number
    pageNum: number
}

/** Common pagination query params */
export interface PageQuery {
    pageNum: number
    pageSize: number
}
