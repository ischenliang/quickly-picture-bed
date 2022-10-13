import { SettingInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { reactive, Ref, ref } from 'vue'

const useAppStore = defineStore('app', () => {
  /**
   * 变量
   */
  const systemConfig: { config: SettingInter } = reactive({
    config: {
      upload: {
        accept: ['jpg', 'png', 'gif', 'webp', 'jpeg'],
        maxcount: 10
      }
    }
  })

  /**
   * 函数
   */
  // 更新用户信息
  const updateSystemConfig = (payload: SettingInter) => {
    systemConfig.config = payload
  }


  return {
    systemConfig,
    updateSystemConfig
  }
})

export default useAppStore