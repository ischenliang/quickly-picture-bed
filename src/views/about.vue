<template>
  <div>
    <button @click="handleClick">点击我</button>
    <button @click="handleLogin">登录</button>
  </div>
</template>

<script lang="ts" setup>
import { JsonResponse } from '@/typings/res';
import { Users } from '@/types/User';
import { UserInter } from '@/typings/interface';

/**
 * 实例
 */
const user = new Users()


/**
 * 回调函数
 */
const handleClick = () => {
  let tmp: UserInter = {
    username: 'duli',
    password: '111111',
    email: 'duli@163.com',
    mobilePhoneNumber: '15528117173',
    avatar: '03'
  }
  user.create(tmp).then((res: JsonResponse<UserInter>) => {
    console.log(res)
  })
}
const handleLogin = () => {
  user.login({
    username: 'itchenliang',
    password: '111111'
  }).then((res: JsonResponse<UserInter>) => {
    // console.log(res)
    user.isAuthenticated().then((authenticated: boolean) => {
      if (authenticated) {
        console.log('有效')
      } else {
        console.log('无效')
      }
    })
  })

  // user.resetPwd().then(res => {
  //   console.log(res)
  // })
}
</script>

<style lang="scss">

</style>