import { PageReq } from '@/typings/req-res';
import { UserInter } from './../typings/interface';
import http from '@/api'


// 筛选条件
interface Filter extends PageReq {
  username?: string,
  desc?: string,
  phone?: string
  role?: number
}


interface Params extends UserInter {
  verify_code?: string
  verify_id?: string
  type?: string
  sms_code?: string
}

/**
 * ================= 用户管理 =================
 * 用于管理员对本系统上的所有用户进行管理
 * ===========================================
 */
export default class Users {
  // 创建用户
  create (params: UserInter) {
    return http('/user/create', params)
  }
  // 删除用户
  delete (id: string) {
    return http('/user/delete', { id })
  }
  // 更新用户
  update (params: UserInter) {
    return http('/user/update', params)
  }
  // 用户详情
  detail (id: number) {
    return http('/user/detail', { id })
  }
  // 更新用户属性
  updateByPro (id: string, property: string, value: any) {
    return http('/user/update', {
      id,
      property,
      value
    })
  }
  // 重置密码
  resetPwd (id: string) {
    return http('/user/resetPwd', { id })
  }
  // 查找用户
  // 查询列表
  find (params: Filter) {
    return http('/user/list', params)
  }
  // 登录
  login (params: Params) {
    return http('/login', params)
  }
  // 重置密码
  forget (params: {
    account: string
    password: string
    sms_code: string
  }) {
    return http('/forget', params)
  }
  // 注册用户
  register (params: {
    account: string
    password: string
    sms_code: string
  }) {
    return http('/register', params)
  }
  // 当前登录用户
  current () {
    return http('/user/current', {})
  }
  // 保存
  save (params: UserInter) {
    return http('/user/update', params)
  }
  // 保存
  changePwd (params: { password: string, old_password: string }) {
    return http('/user/changePwd', params)
  }
  // 切换用户状态
  toggleStatus (id: string) {
    return http('/user/toggle', { id })
  }
}