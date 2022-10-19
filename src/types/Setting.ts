import { useCurrentUser } from '@/hooks/global';
import { ImageInter, SettingInter } from '@/typings/interface';
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
  private async create (params: ImageInter) {
    const instance = new AV.Object(this.modelName);
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    return useFetch(instance.save())
  }
  private update (params: SettingInter) {
    const obj = AV.Object.createWithoutData(this.modelName, params.id)
    for(let [key, value] of Object.entries(params)) {
      obj.set(key, value)
    }
    return useFetch(obj.save())
  }
  // 查询
  find () {
    const query = new AV.Query(this.modelName)
    return useFetch(query.find(), false)
  }
  // 保存
  save (params: SettingInter) {
    delete params.website.logo_preview
    delete params.website.ico_preview
    delete params.website.reward_weixin_preview
    delete params.website.reward_alipay_preview
    delete params.createdAt
    delete params.updatedAt
    if (params.id) {
      return this.update(params)
    } else {
      delete params.id
      return this.create(params)
    }
  }
}