import { PageReq } from './../typings/req-res';
import { DictInter } from '@/typings/interface';
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  name?: string
  code?: string
}

/**
 * =========== 字典管理 ===========
 * 所谓字典管理，就是对页面上的一些元数据管理，例如下拉框的可选择类型。
 * ==============================
 */
export default class Dict {
  // 创建
  async create (params: DictInter) {
    return http('/dict/create', params)
  }
  // 删除
  delete (id: string) {
    return http('/dict/delete', { id })
  }
  // 更新
  update (params: DictInter) {
    return http('/dict/update', params)
  }
  // 查询
  find (params: Filter) {
    return http('/dict/list', params)
  }
  // 详情
  detail (id: string) {
    return http('/dict/detail', { id })
  }
  // 查询是否有满足条件的数据
  // 使用场景：当某个字段是唯一时使用
  async detailByPro (property: string, value: string) {
    return http('/dict/findByPro', { property, value })
  }
}