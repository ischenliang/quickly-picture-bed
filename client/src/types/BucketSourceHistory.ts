import { BucketSourceInter } from '@/typings/interface';
import { PageReq } from '@/typings/req-res';
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  bs_id?: string
}
/**
 * =========== 存储桶源 ===========
 * 用于管理员对系统所支持的存储桶类型管理
 * ==============================
 */
export default class BucketSourceHistory {
  // 删除数据
  delete (id: string) {
    return http('/bucketSourceHistory/delete', { id })
  }
  // 查询列表
  find (params: Filter) {
    return http('/bucketSourceHistory/list', params)
  }
  // 详情
  detail (id: string) {
    return http('/bucketSourceHistory/detail', { id })
  }
  // 版本回滚
  rollback (id: string, bs_id: string) {}
}