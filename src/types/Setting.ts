import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import Basic from '../typings/Basic'

/**
 * =========== 系统配置 ===========
 * 用于管理员对本系统的logo、名称以及其他信息配置
 * ==============================
 */
export default class Setting extends Basic {
  constructor () {
    super('Setting')
  }
  async create (params: ImageInter) {
    const instance = new AV.Object(this.modelName);
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    instance.set('uid', useCurrentUser().id)
    return useFetch(instance.save())
  }
  delete () {

  }
  update () {

  }
  find () {

  }
}