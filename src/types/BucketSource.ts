import { BucketSourceInter, BucketSourceConfig } from '@/typings/interface';
import { BucketSourceEnum } from '@/typings/enum';
import { PageReq } from '@/typings/req-res';
import { useFetch } from '@/hooks/fetch'
import AV, { Query, User, File, Role } from 'leancloud-storage'
import Basic from '../typings/Basic'

// 筛选条件
interface Filter extends PageReq {

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
  create (image: BucketSourceInter) {
    for(let [key, value] of Object.entries(image)) {
      this.instance.set(key, value);
    }
    return useFetch(this.instance.save())
  }
  // 删除数据
  delete (id: string) {

  }
  // 更新数据
  update (params: BucketSourceInter) {
    const obj = AV.Object.createWithoutData(this.modelName, params.id)
  }
  // 查询列表
  find (params: Filter) {
    const { page, size } = params
    const query = new AV.Query(this.modelName)
    query.skip((page - 1) * size)
    query.limit(size)
    return useFetch(query.findAndCount())
  }
  // 详情
  detail (id: string) {
    // const query = new AV.Query(this.modelName)
    // return useFetch(query.get(id))
  }
}