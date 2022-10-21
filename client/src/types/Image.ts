import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch, usePromise } from '@/hooks/fetch'
import AV, { Query, User, File, Role } from 'leancloud-storage'
import Basic from '../typings/Basic'
import { PageReq } from '@/typings/req-res';
import { initAv } from './av';

// 筛选条件
interface Filter extends PageReq {
  uid?: string
  img_name?: string
  bucket_id?: string
}

/**
 * =========== 图片管理 ===========
 * 用于对用户在本系统上传的图片管理
 * ==============================
 */
export default class Image extends Basic {
  constructor () {
    super('Image')
  }
  // 新建
  async create (params: ImageInter) {
    initAv()
    const instance = new AV.Object(this.modelName)
    for(let [key, value] of Object.entries(params)) {
      instance.set(key, value);
    }
    instance.set('uid', useCurrentUser().id)
    const data = await useFetch(instance.save())
    return usePromise(data)
  }
  /**
   * 删除图片
   *  原理：
   *    1、传入image_id查询详情，进而获取到bucket_id
   *    2、拿到bucket_id后拿到config
   *    3、拿到bucket_config后根据bucket_type来调用不同的utils文件的删除函数，先将文件删除
   *    4、文件删除后，再删除该条记录
   * @param id 
   * @returns 
   */
  delete (id: string) {
    initAv()
    const obj = AV.Object.createWithoutData(this.modelName, id)
    return useFetch(obj.destroy())
  }
  // 更新
  update () {

  }
  // 查询
  async find (params: Filter) {
    const query = new AV.Query(this.modelName)
    if (params.uid) {
      query.equalTo('uid', params.uid)
    } else {
      query.equalTo('uid', useCurrentUser().id)
    }

    // 精准查询
    ['bucket_id'].forEach(item => {
      if (params[item]) {
        query.equalTo(item, params[item])
      }
    });

    // 模糊查询
    ['img_name'].forEach(item => {
      if (params[item]) {
        query.contains(item, params[item])
      }
    });

    const { order = 'desc', sort = 'createdAt' } = params
    // 排序
    if (sort) {
      if (order === 'asc') {
        query.addAscending(sort);
      }
      if (order === 'desc') {
        query.addDescending(sort);
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
  detail () {

  }
}