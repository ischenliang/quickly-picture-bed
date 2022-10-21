import { PageReq } from '@/typings/req-res';
import { UserInter } from './../typings/interface';
import http from '@/api'


// 筛选条件
interface Filter extends PageReq {
  username?: string,
  desc?: string,
  mobilePhoneNumber?: string
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
  }
  // 删除用户
  delete (id: string) {
  }
  // 更新用户
  update (params: UserInter) {
  }
  // 更新用户属性
  updateByPro (id: string, property: string, value: any) {
  }
  // 查找用户
  // 查询列表
  find (params: Filter = {}) {
  }
  // 登录
  login (params: UserInter) {
    return http({
      url: '/login',
      method: 'post',
      data: params
    })
  }
  // 重置密码
  resetPwd () {
  }
  // 注册用户
  register () {

  }
}