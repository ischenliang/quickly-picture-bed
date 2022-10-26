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
  const user_habits: { data: HabitsInter } = reactive({
    data: toRaw(defaultHabits)
  })

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
  // 更新habits
  const updateUserHabits = (payload: HabitsInter) => {
    user_habits.data = payload
  }

  return {
    userInfo,
    user_habits,
    currentImage,
    updateUserInfo,
    updateUserHabits
  }
})

export default useUserStore