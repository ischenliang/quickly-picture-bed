/**
 * 针对详情的响应类型
 */

/**
 * 通用列表实体类型
 */
export interface JsonResponse<T> {
  data: T
}

export interface BasicResponse<T> {
  total: number
  data: Array<T>
}