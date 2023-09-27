
import { PageReq } from '@/typings/req-res';
import { AlbumInter, TagInter } from '@/typings/interface'
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  uid?: number
  id?: number
  desc?: string
  name?: string
  tag?: string
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
  delete (id: number) {
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
  detail (id: number) {
    return http('/album/detail', { id })
  }
  // 图片列表
  images (params: Filter) {
    return http('/album/images', params)
  }
  // 标签列表
  tags (id: number) {
    return http('/album-tags/detail', { album_id: id })
  }
  // 更新标签
  updateTags (album_id: number, tags: TagInter[]) {
    return http('/album-tags/update', {
      album_id,
      tags
    })
  }
  // 排序
  sort (from: number, to: number) {
    return http('/album/sort', {
      from,
      to
    })
  }
}