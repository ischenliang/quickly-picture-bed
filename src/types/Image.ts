import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV, { Query, User, File, Role } from 'leancloud-storage'
import Basic from '../typings/Basic'

/**
 * =========== 图片管理 ===========
 * 用于对用户在本系统上传的图片管理
 * ==============================
 */
export default class Image {
  modelName = 'Image'
  constructor () {

  }
  // 新建
  async create (params: ImageInter) {
    const instance = new AV.Object(this.modelName)
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    instance.set('uid', useCurrentUser().id)
    const data = await useFetch(instance.save())
    return usePromise(data)
  }
  // 删除图片：删除之前还应将远程资源上的图片删除
  delete (id: string) {
    const obj = AV.Object.createWithoutData(this.modelName, id)
    return useFetch(obj.destroy())
  }
  // 更新
  update () {

  }
  // 查询
  find () {

  }
  // 详情
  detail () {

  }
}