import { BucketSourceInter } from '@/typings/interface';
import { PageReq } from '@/typings/req-res';
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  name?: string,
  type?: string
  status?: boolean
}
/**
 * =========== 存储桶源 ===========
 * 用于管理员对系统所支持的存储桶类型管理
 * ==============================
 */
export default class BucketSource {
  // 新建数据
  async create (params: BucketSourceInter) {
    return http('/bucketSource/create', params)
  }
  // 删除数据
  delete (id: string) {
    return http('/bucketSource/delete', { id })
  }
  // 更新数据
  update (params: BucketSourceInter) {
    return http('/bucketSource/update', params)
  }
  // 查询列表
  find (params: Filter) {
    return http('/bucketSource/list', params)
  }
  // 详情
  detail (id: string) {
    return http('/bucketSource/detail', { id })
  }
  // 切换状态
  switch (id: string) {
    return http('/bucketSource/switch', { id })
  }
  // 版本回滚
  // hid: 历史记录id  bid：存储桶id
  rollback (hid: string, bid: string) {
    return http('/bucketSource/rollback', {
      hid,
      bid
    })
  }
}