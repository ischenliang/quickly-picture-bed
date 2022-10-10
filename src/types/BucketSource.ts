import { BucketSourceInter, BucketSourceConfig } from '@/typings/interface';
import { BucketSourceEnum } from '@/typings/enum';
import { PageReq } from '@/typings/req-res';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import Basic from '../typings/Basic'

// 筛选条件
interface Filter extends PageReq {
  name?: string,
  type?: string
}
/**
 * =========== 存储桶源 ===========
 * 用于管理员对系统所支持的存储桶类型管理
 * ==============================
 */
export default class BucketSource extends Basic {
  constructor () {
    super('BucketSource')
  }
  // 新建数据
  async create (params: BucketSourceInter) {
    const instance = new AV.Object(this.modelName);
    // 判断是否已经存在
    const query = new AV.Query(this.modelName);
    query.equalTo('type', params.type);
    const res: any = await useFetch(query.find())
    if (res.data && res.data.id) {
      return usePromise(null, {
        msg: '存储源类别已存在'
      })
    }

    // 不存在：直接创建
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    return useFetch(instance.save())
  }
  // 删除数据
  delete (id: string) {
    const obj = AV.Object.createWithoutData(this.modelName, id)
    return useFetch(obj.destroy())
  }
  // 更新数据
  update (params: BucketSourceInter) {
    const obj = AV.Object.createWithoutData(this.modelName, params.id)
    for(let [key, value] of Object.entries(params)) {
      obj.set(key, value)
    }
    return useFetch(obj.save())
  }
  // 查询列表
  find (params: Filter) {
    const query = new AV.Query(this.modelName)
    // 排序
    if (params.sort) {
      if (params.order === 'asc') {
        query.addAscending(params.sort);
      }
      if (params.order === 'desc') {
        query.addDescending(params.sort);
      }
    }

    // 模糊查询
    ['name', 'type'].forEach(item => {
      if (params[item]) {
        query.contains(item, params[item])
      }
    })

    // 分页
    if (params.page) {
      const { page = 1, size = 10 } = params
      query.skip((page - 1) * size)
      query.limit(params.size)
      return useFetch(query.findAndCount())
    }
    return useFetch(query.find(), false)
  }
  // 详情
  detail (id: string) {
    const obj = new AV.Query(this.modelName)
    return useFetch(obj.get(id))
  }
}