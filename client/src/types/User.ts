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


/**
 * ================= 用户管理 =================
 * 用于管理员对本系统上的所有用户进行管理
 * ===========================================
 */
export default class Users {
  // 创建用户
  create (params: UserInter) {
    return http('/user/login', params)
  }
  // 删除用户
  delete (id: string) {
    return http('/user/delete', { id })
  }
  // 更新用户
  update (params: UserInter) {
    return http('/user/update', params)
  }
  // 更新用户属性
  updateByPro (id: string, property: string, value: any) {
    return http('/user/update', {
      id,
      property,
      value
    })
  }
  // 查找用户
  // 查询列表
  find (params: Filter) {
    return http('/user/list', params)
  }
  // 登录
  login (params: UserInter) {
    return http('/login', params)
  }
  // 重置密码
  resetPwd () {
  }
  // 注册用户
  register () {

  }
}