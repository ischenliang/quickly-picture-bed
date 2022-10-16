import { UserInter, HabitsInter, ImageInter } from '@/typings/interface'
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
  user_habits.current = {
    id: ''
  }
  user_habits.link_format = 'URL'

  // 当前图片
  const currentImage: Ref<ImageInter> = ref({
    id: '',
    img_url: '',
    img_size: 0,
    img_height: 0,
    img_width: 0,
    img_name: ''
  })

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
    currentImage,
    updateUserInfo
  }
})

export default useUserStore