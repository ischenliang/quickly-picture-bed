import { useCurrentUser } from '@/hooks/global';
import { JsonResponse } from '../typings/res';
import { UserInter } from './../typings/interface';
import { useFetch, usePromise } from '@/utils/Promise'
import AV from 'leancloud-storage'

export class Users implements UserInter {
  id?: string
  username?: string
  password?: string
  email?: string
  emailVerified?: boolean
  mobilePhoneNumber?: string
  mobilePhoneVerified?: boolean
  avatar?: string
  major?: string
  gender?: string
  desc?: string
  address?: string
  role?: number
  join_type?: number
  createdAt?: string
  updatedAt?: string
  user = null
  constructor () {
    this.user = new AV.User()
  }
  create (params: UserInter) {
    for(let [key, value] of Object.entries(params)) {
      this.user.set(key, value);
    }
    return useFetch(this.user.signUp())
  }
  // 删除用户
  delete () {

  }
  update () {

  }
  find () {

  }
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
  private getSessionToken () {
    return useCurrentUser().getSessionToken()
  }
  // 检查 session token 是否有效
  isAuthenticated () {
    return useFetch(useCurrentUser().isAuthenticated())
  }
  // 重置密码
  resetPwd () {
    const query = new AV.Query('_User');
    return useFetch(query.find(), false)
  }
}