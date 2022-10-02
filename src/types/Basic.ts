import AV from 'leancloud-storage'
export default class Basic {
  // 名称
  modelName: string
  // 实例
  instance = null
  constructor (model: string) {
    this.modelName = model
    this.instance = new AV.Object(model)
  }
}