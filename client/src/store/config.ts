import { SettingInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { reactive, Ref, ref } from 'vue'

/**
 * 系统配置定义
 */
const useConfigStore = defineStore('config', () => {
  /**
   * 变量
   */
  // 系统界面配置
  const config = reactive({
    siderbar: 240, // 菜单栏宽度
    header: 60, // 底部菜单栏高度
    pageAction: 50, // 页操作栏高度
  })
  // 系统后台配置
  const systemConfig: Ref<SettingInter> = ref({})

  // 更新数据
  const updateSystemConfig = (payload) => {
    systemConfig.value = payload
  }

  return {
    config,
    systemConfig,
    updateSystemConfig
  }
})

export default useConfigStore