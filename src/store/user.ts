import { UserInter, HabitsInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { reactive, Ref, ref, toRaw } from 'vue'
import { user_habits as defaultHabits } from '@/global.config'

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
  const user_habits: HabitsInter = reactive(toRaw(defaultHabits))
  // 测试时默认使用第个项存储桶
  user_habits.current = '633e8a1331a5a915d528eab5'
  user_habits.link_format = 'URL'

  /**
   * 函数
   */
  // 更新用户信息
  const updateUserInfo = (payload: UserInter) => {
    userInfo.value = payload
  }


  return {
    userInfo,
    user_habits,
    updateUserInfo
  }
})

export default useUserStore