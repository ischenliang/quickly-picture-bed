import { UserInter, HabitsInter, ImageInter, LogInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { markRaw, reactive, Ref, ref, toRaw, unref } from 'vue'
import { user_habits as defaultHabits } from '@/global.config'
import { RouteRecordRaw } from 'vue-router'
import PluginManager from '@/typings/PluginManager'

const useUserStore = defineStore('user', () => {
  /**
   * 变量
   */
  const userInfo: Ref<UserInter> = ref(null)
  const user_habits: { data: HabitsInter } = reactive({
    data: toRaw(defaultHabits)
  })
  // 筛选数据
  const list_filter = ref({})

  // 当前图片
  const currentImages: Ref<ImageInter[]> = ref([{
    id: '',
    img_url: '',
    img_size: 0,
    img_height: 0,
    img_width: 0,
    img_name: ''
  }])

  // 今日操作记录
  const user_logs: Ref<LogInter[]> = ref([])

  // 菜单列表
  const user_menus: Ref<RouteRecordRaw[]> = ref([])

  // 插件管理器
  const pluginManager: Ref<PluginManager> = ref(null)

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
  // 更新筛选数据
  const updateListFilter = (payload) => {
    if (payload) {
      localStorage.setItem('list_filter', JSON.stringify(payload))
    } else {
      localStorage.removeItem('list_filter')
    }
    list_filter.value = payload
  }
  // 更新插件管理器
  const updatePluginManager = (payload: PluginManager) => {
    pluginManager.value = payload
  }

  return {
    userInfo,
    user_habits,
    currentImages,
    user_logs,
    user_menus,
    list_filter,
    pluginManager,
    updateUserInfo,
    updateUserHabits,
    updateUserLogs,
    updateUserMenus,
    updateListFilter,
    updatePluginManager
  }
})

export default useUserStore