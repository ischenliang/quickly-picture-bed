import { SettingInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

const useAppStore = defineStore('app', () => {
  /**
   * 变量
   */
  const systemConfig: Ref<SettingInter> = ref(null)

  /**
   * 函数
   */
  // 更新用户信息
  const updateSystemConfig = (payload: SettingInter) => {
    systemConfig.value = payload
  }


  return {
    systemConfig,
    updateSystemConfig
  }
})

export default useAppStore