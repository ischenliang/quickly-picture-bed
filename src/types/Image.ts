import { useCurrentUser } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import { useFetch } from '@/utils/Promise'
import AV, { Query, User, File, Role } from 'leancloud-storage'
import Basic from './Basic'

export class Image extends Basic implements ImageInter {
  id?: string // 图片id
  img_name?: string // 图片名称
  img_width?: number // 图片宽度
  img_height?: number // 图片高度
  mine_type?: string // 文件类型
  img_url?: string // 图片url
  img_size?: number // 图片大小
  bucket_id: string // 存储桶id
  bucket_type?: string // 存储桶类型
  uid?: string // 用户id
  sort?: number // 排序值
  constructor () {
    super('Image')
  }
  async create (image: ImageInter) {
    for(let [key, value] of Object.entries(image)) {
      this.instance.set(key, value);
    }
    this.instance.set('uid', useCurrentUser().id)
    return useFetch(this.instance.save())
  }
  delete () {

  }
  update () {

  }
  find () {

  }
}