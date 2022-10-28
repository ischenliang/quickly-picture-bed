import { UserInter, HabitsInter, ImageInter, LogInter } from '@/typings/interface'
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

  // 今日操作记录
  const user_logs: Ref<LogInter[]> = ref([])

  /**
   * 函数
   */
  // 更新用户信息
  const updateUserInfo = (payload: UserInter) => {
    userInfo.value = toRaw(payload)
  }
  // 更新habits
  const updateUserHabits = (payload: HabitsInter) => {
    if (payload) {
      user_habits.data = toRaw(payload)
    }
  }
  // 更新日志
  const updateUserLogs = (payload: LogInter[]) => {
    user_logs.value = payload
  } 

  return {
    userInfo,
    user_habits,
    currentImage,
    user_logs,
    updateUserInfo,
    updateUserHabits,
    updateUserLogs
  }
})

export default useUserStore