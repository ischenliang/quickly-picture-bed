import { usePromise } from '@/hooks/fetch';
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
    // 判断是否已经存在
    const query = new AV.Query(this.modelName);
    query.equalTo('code', params.code);
    const res: any = await useFetch(query.first())
    if (res.data) {
      return usePromise(null, {
        msg: '字典代码已存在'
      })
    }

    // 不存在：直接创建
    for(let [key, value] of Object.entries(params)) {
      this.instance.set(key, value);
    }
    return useFetch(this.instance.save())
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
}