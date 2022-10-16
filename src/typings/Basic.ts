import { initAv } from '@/types/av'
import AV from 'leancloud-storage'
export default class Basic {
  // 名称
  modelName: string
  // // 实例
  // instance = null
  constructor (model: string) {
    this.modelName = model

    // 不能直接这样全局构造实例，否则会导致批量操作数据时只有一条数据被保存
    // this.instance = new AV.Object(model)
    // 注意：这里的serverURL必须是非国际版的才支持使用，所以在创建应用时选择非国际版
    initAv()
  }
}