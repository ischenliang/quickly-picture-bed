import { DictInter, SettingInter } from '@/typings/interface'
import { defineStore } from 'pinia'
import { reactive, Ref, ref, toRaw } from 'vue'

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

  // 类型
  const payment_types = ref([
    {
      "label": "付费",
      "value": "paid"
    },
    {
      "label": "限时免费",
      "value": "limited_free"
    },
    {
      "label": "免费",
      "value": "free"
    }
  ])

  // 字典列表
  const dicts: Ref<DictInter[]> = ref([])

  // 更新数据
  const updateSystemConfig = (payload) => {
    systemConfig.value = toRaw(payload)
  }

  // 更新字典
  function updateDicts (payload: DictInter[]) {
    dicts.value = payload
  }

  return {
    config,
    dicts,
    systemConfig,
    payment_types,
    updateSystemConfig,
    updateDicts
  }
})

export default useConfigStore