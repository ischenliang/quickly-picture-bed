import { UserInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

// const useUserStore = defineStore('user', {
//   state: () => ({
//     userInfo: null
//   }),
//   actions: {
//     updateUserInfo () {

//     }
//   }
// })


const useUserStore = defineStore('user', () => {
  /**
   * 变量
   */
  const userInfo: Ref<UserInter> = ref(null)

  /**
   * 函数
   */
  // 更新用户信息
  const updateUserInfo = (payload: UserInter) => {
    userInfo.value = payload
  }


  return {
    userInfo,
    updateUserInfo
  }
})

export default useUserStore