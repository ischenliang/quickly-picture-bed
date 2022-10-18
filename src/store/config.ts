import { defineStore } from 'pinia'
import { reactive } from 'vue'

/**
 * 系统配置定义
 */
const useConfigStore = defineStore('config', () => {
  /**
   * 变量
   */
  const config = reactive({
    siderbar: 240, // 菜单栏宽度
    header: 60, // 底部菜单栏高度
    pageAction: 50, // 页操作栏高度
  })
  return {
    config
  }
})

export default useConfigStore