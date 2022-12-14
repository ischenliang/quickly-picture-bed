import { UserInter, HabitsInter, ImageInter, LogInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { markRaw, reactive, Ref, ref, toRaw, unref } from 'vue'
import { user_habits as defaultHabits } from '@/global.config'
import { RouteRecordRaw } from 'vue-router'

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

  // 菜单列表
  const user_menus: Ref<RouteRecordRaw[]> = ref([])

  /**
   * 函数
   */
  // 更新用户信息
  const updateUserInfo = (payload: UserInter) => {
    userInfo.value = JSON.parse(JSON.stringify(payload))
  }
  // 更新habits
  const updateUserHabits = (payload: HabitsInter) => {
    if (payload) {
      user_habits.data = JSON.parse(JSON.stringify(payload))
    }
  }
  // 更新日志
  const updateUserLogs = (payload: LogInter[]) => {
    user_logs.value = toRaw(payload)
  }
  // 更新菜单
  const updateUserMenus = (payload: RouteRecordRaw[]) => {
    user_menus.value = toRaw(payload)
  }

  return {
    userInfo,
    user_habits,
    currentImage,
    user_logs,
    user_menus,
    updateUserInfo,
    updateUserHabits,
    updateUserLogs,
    updateUserMenus
  }
})

export default useUserStore