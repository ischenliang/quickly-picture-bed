import { useCurrentUser } from '@/hooks/global';
import { PageReq } from '@/typings/req-res';
import { LogInter } from '@/typings/interface';
import { useFetch } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import Basic from '../typings/Basic'

// 筛选条件
interface Filter extends PageReq {
  uid?: string
}


/**
 * =========== 日志管理 || 动态管理 ===========
 * 用于对用户在本系统上的所有操作日志记录，主要记录系统操作和图片操作
 * ===========================================
 */
export default class Log extends Basic {
  constructor () {
    super('Log')
  }
  create (params: LogInter) {
    for(let [key, value] of Object.entries(params)) {
      this.instance.set(key, value);
    }
    this.instance.set('uid', useCurrentUser().id)
    return useFetch(this.instance.save())
  }
  delete () {

  }
  update () {

  }
  async find (params: Filter) {
    const { uid } = params
    const query = new AV.Query(this.modelName)
    query.equalTo('uid', uid ? uid : useCurrentUser().id)
    // 通过判断是否传入page属性来确定是否分页
    if (params.page) {
      const { page = 1, size = 10 } = params
      query.skip((page - 1) * size)
      query.limit(params.size)
      return useFetch(query.findAndCount())
    }
    return useFetch(query.find(), false)
  }
  detail () {
  }
}