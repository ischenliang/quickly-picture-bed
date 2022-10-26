
import { PageReq } from '@/typings/req-res';
import { BucketInter } from '@/typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  uid?: string,
  visible?: boolean
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
  delete (id: string, uid: string) {
    return http('/bucket/delete', { id })
  }
  // 更新
  update (params: BucketInter) {
    return http('/bucket/update', params)
  }
  // 更新用户属性
  updateByPro (id: string, uid: string, property: string, value: any) {
    return http('/bucket/update', {
      id,
      [property]: value
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
}