import { PageReq } from '../typings/req';
import { BucketInter } from '@/typings/interface';
import { useFetch } from '@/utils/Promise'
import AV from 'leancloud-storage'
import Basic from './Basic'
import { useCurrentUser } from '@/hooks/global';

// 筛选条件
interface Filter extends PageReq {
  uid?: string
}

export class Bucket extends Basic implements BucketInter {
  id?: string
  type?: string
  tag?: string
  name?: string
  config?: string
  visible?: boolean
  createdAt?: string
  updatedAt?: string
  uid?: string
  constructor () {
    super('Bucket')
  }
  create (params: BucketInter) {
    for(let [key, value] of Object.entries(params)) {
      this.instance.set(key, value);
    }
    this.instance.set('uid', useCurrentUser().id)
    return useFetch(this.instance.save())
  }
  delete (id: string, uid: string) {
    const obj = AV.Object.createWithoutData(this.modelName, id)
    return useFetch(obj.destroy())
  }
  update () {

  }
  async find (params: Filter) {
    const query = new AV.Query(this.modelName)
    if (params.uid) {
      query.equalTo('uid', params.uid)
    } else {
      query.equalTo('uid', useCurrentUser().id)
    }
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