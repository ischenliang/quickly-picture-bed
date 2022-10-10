
import { PageReq } from '@/typings/req-res';
import { BucketInter } from '@/typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV from 'leancloud-storage'
import { useCurrentUser } from '@/hooks/global';
import Basic from '@/typings/Basic';

// 筛选条件
interface Filter extends PageReq {
  uid?: string
}

/**
 * =========== 存储桶 ===========
 * 用于自己创建图床服务，支持leancloud本地桶、七牛云、gitee、github
 * ==============================
 */
export default class Bucket extends Basic {
  constructor () {
    super('Bucket')
  }
  // 新建
  create (params: BucketInter) {
    const instance = new AV.Object(this.modelName);
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    instance.set('uid', useCurrentUser().id)
    return useFetch(instance.save())
  }
  // 删除
  delete (id: string, uid: string) {
    if (uid === useCurrentUser().id) {
      const obj = AV.Object.createWithoutData(this.modelName, id)
      return useFetch(obj.destroy())
    }
    return usePromise(null, {
      msg: '禁止删除他人的存储桶'
    })
  }
  // 更新
  update (params: BucketInter) {
    if (params.uid === useCurrentUser().id) {
      const obj = AV.Object.createWithoutData(this.modelName, params.id)
      for(let [key, value] of Object.entries(params)) {
        obj.set(key, value)
      }
      return useFetch(obj.save())
    } else {
      return usePromise(null, {
        msg: '禁止修改他人的存储桶'
      })
    }
  }
  // 更新用户属性
  updateByPro (id: string, uid: string, property: string, value: any) {
    if (uid === useCurrentUser().id) {
      const obj = AV.Object.createWithoutData(this.modelName, id)
      obj.set(property, value)
      return useFetch(obj.save())
    } else {
      return usePromise(null, {
        msg: '禁止修改他人存储桶'
      })
    }
  }
  // 查询
  async find (params: Filter) {
    const query = new AV.Query(this.modelName)
    if (params.uid) {
      query.equalTo('uid', params.uid)
    } else {
      query.equalTo('uid', useCurrentUser().id)
    }

    // 排序
    if (params.sort) {
      if (params.order === 'asc') {
        query.addAscending(params.sort);
      }
      if (params.order === 'desc') {
        query.addDescending(params.sort);
      }
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
  // 详情
  detail (id: string) {
    const obj = new AV.Query(this.modelName)
    return useFetch(obj.get(id))
  }
}