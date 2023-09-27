import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV, { Query, User, File, Role } from 'leancloud-storage'
import Basic from '../typings/Basic'
import { PageReq } from '@/typings/req-res';
import { initAv } from './av';
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  uid?: string
  img_name?: string
  bucket_id?: string
}

/**
 * =========== 图片管理 ===========
 * 用于对用户在本系统上传的图片管理
 * ==============================
 */
export default class Image {
  // 新建
  async upload (params: any, callback: Function) {
    return http('/image/upload', params, callback)
  }
  /**
   * 删除图片
   *  原理：
   *    1、传入image_id查询详情，进而获取到bucket_id
   *    2、拿到bucket_id后拿到config
   *    3、拿到bucket_config后根据bucket_type来调用不同的utils文件的删除函数，先将文件删除
   *    4、文件删除后，再删除该条记录
   * @param id 
   * @returns 
   */
  delete (id: number) {
    return http('/image/delete', { id })
  }
  // 更新
  update (params: ImageInter) {
    return http('/image/update', params)
  }
  // 查询
  async find (params: Filter) {
    return http('/image/list', params)
  }
  // 详情
  detail (id: string | number) {
    return http('/image/detail', { id })
  }
  // 排序
  sort (from: number, to: number) {
    return http('/image/sort', {
      from,
      to
    })
  }
}