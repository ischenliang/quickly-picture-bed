import { PageReq } from '@/typings/req-res';
import { WikiInter } from '@/typings/interface';
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  status?: boolean
}


/**
 * =========== 知识库管理 ===========
 * 包括知识库空间管理、文章管理
 * ===========================================
 */
export default class Wiki {
  // 创建知识库
  create (params: WikiInter) {
    return http('/wiki/create', params)
  }
  // 更新知识库
  update (params: WikiInter) {
    return http('/wiki/update', params)
  }
  // 删除知识库
  delete (id: number) {
    return http('/wiki/delete', { id })
  }
  // 知识库详情
  detail (id: number) {
    return http('/wiki/detail', { id })
  }
  // 知识库列表
  find (params: Filter) {
    return http('/wiki/list', params)
  }
  // 复制知识库
  copy (id: number, name: string) {
    return http('/wiki/copy', { id, name })
  }
  /**
   * 知识库文档管理
   */
  getArticles (wid: number) {
    return http('/article/page-tree', { wid })
  }
  // 文档详情
  getArticleDetail (id: number) {
    return http('/article/detail', { id })
  }
  // 排序
  sort (from: number, to: number) {
    return http('/wiki/sort', {
      from,
      to
    })
  }
}