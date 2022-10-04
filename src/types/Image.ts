import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch } from '@/hooks/fetch'
import AV, { Query, User, File, Role } from 'leancloud-storage'
import Basic from '../typings/Basic'

/**
 * =========== 图片管理 ===========
 * 用于对用户在本系统上传的图片管理
 * ==============================
 */
export default class Image extends Basic {
  constructor () {
    super('Image')
  }
  async create (params: ImageInter) {
    for(let [key, value] of Object.entries(params)) {
      this.instance.set(key, value);
    }
    this.instance.set('uid', useCurrentUser().id)
    return useFetch(this.instance.save())
  }
  delete () {

  }
  update () {

  }
  find () {

  }
}