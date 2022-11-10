import { ImageInter, SettingInter } from '@/typings/interface';
import http from '@/api'

/**
 * =========== 系统配置 ===========
 * 用于管理员对本系统的logo、名称以及其他信息配置
 * ==============================
 */
export default class VerifyCode {
  // 图形验证码
  async create (params: { last_id: string }) {
    return http('/tool/imgCreate', params)
  }
  // 邮箱或者手机验证码
  async smsSend (params: { account: string, verify_code: string, verify_id: string, type: string }) {
    return http('/tool/smsSend', params)
  }
}