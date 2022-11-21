
import { PageReq } from '@/typings/req-res';
import { AlbumInter } from '@/typings/interface'
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  uid?: string
  id?: string
  desc?: string
  name?: string
}

/**
 * =========== 相册 ===========
 * 用于创建自己的相册
 * ==============================
 */
export default class Album {
  // 新建
  create (params: AlbumInter) {
    return http('/album/create', params)
  }
  // 删除
  delete (id: string) {
    return http('/album/delete', { id })
  }
  // 更新
  update (params: AlbumInter) {
    return http('/album/update', params)
  }
  // 查询
  async find (params: Filter) {
    return http('/album/list', params)
  }
  // 详情
  detail (id: string) {
    return http('/album/detail', { id })
  }
  // 图片列表
  images (params: Filter) {
    return http('/album/images', params)
  }
}