import { ImageInter, SettingInter } from '@/typings/interface';
import http from '@/api'

/**
 * =========== 系统配置 ===========
 * 用于管理员对本系统的logo、名称以及其他信息配置
 * ==============================
 */
export default class Setting {
  private async create (params: ImageInter) {
    return http('/setting/create', params)
  }
  private update (params: SettingInter) {
    return http('/setting/update', params)
  }
  // 查询
  find () {
    return http('/setting/list', {})
  }
  // 保存
  save (params: SettingInter) {
    if (params.id) {
      return this.update(params)
    } else {
      delete params.id
      return this.create(params)
    }
  }
  // 默认配置
  default () {
    return http('/setting/default', {
      notAuth: true
    })
  }
}