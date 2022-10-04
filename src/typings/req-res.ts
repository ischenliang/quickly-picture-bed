/**
 * 请求参数类型和响应结果类型定义
 */

export interface PageReq {
  // 页码
  page?: number
  // 每页显示数量
  size?: number
  // 排序字段
  sort?: string
  // 排序方式
  order?: string
}

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