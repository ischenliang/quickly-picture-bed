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
        maxcount: 10, // 一次性最多上传多少个文件
        maxsize: 2 // 单文件最大限制(M)
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