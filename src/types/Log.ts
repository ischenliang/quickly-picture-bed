import { useCurrentUser } from '@/hooks/global';
import { PageReq } from '../typings/req';
import { LogInter } from '@/typings/interface';
import { useFetch } from '@/utils/Promise'
import AV from 'leancloud-storage'
import Basic from './Basic'

// 筛选条件
interface Filter extends PageReq {
  uid?: string
}

export class Log extends Basic implements LogInter {
  id?: string
  type?: number
  operate_id?: string
  operate_cont?: string
  content?: string
  createdAt?: string
  uid?: string
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