import { useFormatRes, usePromise } from '@/hooks/fetch';
import { PageReq } from './../typings/req-res';
import { DictInter } from '@/typings/interface';
import { useCurrentUser } from '@/hooks/global';
import { useFetch } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import Basic from '../typings/Basic'

// 筛选条件
interface Filter extends PageReq {
  name?: string
  code?: string
}

/**
 * =========== 字典管理 ===========
 * 所谓字典管理，就是对页面上的一些元数据管理，例如下拉框的可选择类型。
 * ==============================
 */
export default class Dict extends Basic {
  constructor () {
    super('Dict')
  }
  // 创建
  async create (params: DictInter) {
    const instance = new AV.Object(this.modelName);
    // 判断是否已经存在
    const query = new AV.Query(this.modelName);
    query.equalTo('code', params.code);
    const res: any = await useFetch(query.find())
    if (res.data && res.data.id) {
      return usePromise(null, {
        msg: '字典代码已存在'
      })
    }

    // 不存在：直接创建
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    return useFetch(instance.save())
  }
  // 删除
  delete (id: string) {
    const obj = AV.Object.createWithoutData(this.modelName, id)
    return useFetch(obj.destroy())
  }
  // 更新
  update (params: DictInter) {
    const obj = AV.Object.createWithoutData(this.modelName, params.id)
    for(let [key, value] of Object.entries(params)) {
      obj.set(key, value)
    }
    return useFetch(obj.save())
  }
  // 查询
  find (params: Filter) {
    const query = new AV.Query(this.modelName)
    // query.equalTo('uid', params.uid ? params.uid : useCurrentUser().id)
    
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
    ['name', 'code'].forEach(item => {
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
  // 查询是否有满足条件的数据
  // 使用场景：当某个字段是唯一时使用
  async findByOnly (property: string, value: string) {
    const obj = new AV.Query(this.modelName)
    const res = await obj.first()
    if (res && res.id) {
      return usePromise(null, '数据已经存在了')
    } else {
      return usePromise(res)
    }
  }
  // 查询是否有满足条件的数据
  // 使用场景：当某个字段是唯一时使用
  async detailByPro (property: string, value: string) {
    const obj = new AV.Query(this.modelName)
    obj.equalTo(property, value)
    const res = await obj.first()
    // 数据存在：将数据格式化返回
    // 数据不存在：考虑抛出异常还是返回空数据
    if (res && res.id) {
      return usePromise(useFormatRes(res))
    } else {
      return usePromise(null)
    }
  }
}