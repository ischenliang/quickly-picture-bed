import { PageReq } from '@/typings/req-res';
import { useCurrentUser } from '@/hooks/global';
import { JsonResponse } from '../typings/req-res';
import { UserInter } from './../typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import { useFormat } from '@/hooks/date-time';
import Basic from '@/typings/Basic';

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
export default class Users extends Basic {
  user = null
  constructor () {
    super('_User')
    this.user = new AV.User()
  }
  // 创建用户
  create (params: UserInter) {
    for(let [key, value] of Object.entries(params)) {
      this.user.set(key, value);
    }
    return useFetch(this.user.signUp())
  }
  // 删除用户
  delete (id: string) {
    const obj = AV.Object.createWithoutData(this.modelName, id)
    return useFetch(obj.destroy())
  }
  // 更新用户
  update (params: UserInter) {
    const obj = AV.Object.createWithoutData(this.modelName, params.id)
    for(let [key, value] of Object.entries(params)) {
      obj.set(key, value)
    }
    return useFetch(obj.save())
  }
  // 更新用户属性
  updateByPro (id: string, property: string, value: any) {
    const obj = AV.Object.createWithoutData(this.modelName, id)
    obj.set(property, value)
    return useFetch(obj.save())
  }
  // 查找用户
  // 查询列表
  find (params: Filter = {}) {
    const query = new AV.Query(this.modelName)
    // 排序
    if (params.sort) {
      if (params.order === 'asc') {
        query.addAscending(params.sort);
      }
      if (params.order === 'desc') {
        query.addDescending(params.sort);
      }
    }

    // 模糊查询
    ['username', 'desc', 'mobilePhoneNumber'].forEach(item => {
      if (params[item]) {
        query.contains(item, params[item])
      }
    })

    // 角色
    if (params.role) {
      query.equalTo('role', params.role)
    }

    // 分页
    if (params.page) {
      const { page = 1, size = 10 } = params
      query.skip((page - 1) * size)
      query.limit(params.size)
      return useFetch(query.findAndCount())
    }
    return useFetch(query.find(), false)
  }
  // 登录
  login (params: UserInter, type: string = 'username') {
    let tmp
    switch (type) {
      case 'username':
        tmp = AV.User.logIn(params.username, params.password)
        break
      case 'email':
        tmp = AV.User.loginWithEmail(params.email, params.password)
        break
      case 'phone':
        tmp = AV.User.logInWithMobilePhone(params.mobilePhoneNumber, params.password)
        break
    }
    return useFetch(tmp).then((res: JsonResponse<UserInter>) => {
      const token = this.getSessionToken()
      return usePromise({
        ...res,
        token
      })
    })
  }
  // 获取token
  private getSessionToken () {
    return useCurrentUser().getSessionToken()
  }
  // 检查 session token 是否有效
  isAuthenticated () {
    const obj = useCurrentUser()
    if (obj) {
      return obj.isAuthenticated()
    }
    return false
  }
  // 重置密码
  resetPwd () {
    const query = new AV.Query('_User');
    return useFetch(query.find(), false)
  }
  // 当前用户
  current () {
    const obj = useCurrentUser()
    return {
      id: obj.id,
      ...obj.attributes,
      createdAt: useFormat(obj.createdAt),
      updatedAt: useFormat(obj.updatedAt)
    }
  }
  // 注册用户
  register () {

  }
}