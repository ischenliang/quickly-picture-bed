
import { PageReq } from '@/typings/req-res';
import { BucketInter } from '@/typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  uid?: string,
  visible?: boolean
  is_only_names?: boolean
}

/**
 * =========== 存储桶 ===========
 * 用于自己创建图床服务，支持leancloud本地桶、七牛云、gitee、github
 * ==============================
 */
export default class Bucket {
  // 新建
  create (params: BucketInter) {
    return http('/bucket/create', params)
  }
  // 删除
  delete (id: number) {
    return http('/bucket/delete', { id })
  }
  // 更新
  update (params: BucketInter) {
    return http('/bucket/update', params)
  }
  // 切换状态
  toggle (id: number) {
    return http('/bucket/toggle', {
      id
    })
  }
  // 查询
  async find (params: Filter) {
    return http('/bucket/list', params)
  }
  // 详情
  detail (id: string) {
    return http('/bucket/detail', { id })
  }
  // 排序
  sort (from: number, to: number) {
    return http('/bucket/sort', {
      from,
      to
    })
  }
}