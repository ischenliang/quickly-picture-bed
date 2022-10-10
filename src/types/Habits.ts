import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import Basic from '../typings/Basic'

/**
 * =========== 使用习惯管理 ===========
 * 针对每个用户使用改图床的习惯配置
 * ==============================
 */
export default class Habits extends Basic {
  constructor () {
    super('Habits')
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