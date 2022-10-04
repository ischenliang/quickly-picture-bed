import { useCurrentUser } from '@/hooks/global';
import { JsonResponse } from '../typings/req-res';
import { UserInter } from './../typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import { useFormat } from '@/hooks/date-time';

/**
 * ================= 用户管理 =================
 * 用于管理员对本系统上的所有用户进行管理
 * ===========================================
 */
export default class Users {
  user = null
  constructor () {
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
  delete () {

  }
  // 更新用户
  update () {

  }
  // 查找用户
  find () {
    console.log(useCurrentUser())
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
}