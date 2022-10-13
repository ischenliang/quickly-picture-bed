import Bucket from "@/types/Bucket"
import { useGetImageSize, useGetSuffix } from "../global"
import AV from 'leancloud-storage'
import { useFileName } from "../date-time"

/**
 * Leancloud存储桶图床配置
 *  参考：https://leancloud.cn/docs/leanstorage_guide-js.html#hash813653189
 */
const bucket = new Bucket()
export default {
  /**
   * 文件上传
   * 原理：
   *    1、根据bucket_id获取存储桶配置
   *        还需要获取用户的习惯
   *    2、拿到存储桶配置后构建出AV.init
   *    3、最后使用AV.file和file.save上传文件
   *    4、将结果数据返回
   * @param bucket_id 存储桶id
   * @param files 文件列表
   * @returns 
   */
  uploadFile (bucket_id: string, files: File[], progress: Function) {
    return new Promise(async (resolve, reject) => {
      // 1、获取存储桶配置
      const res: any = await bucket.detail(bucket_id)
      const { appId, appKey, domain, masterKey, path } = JSON.parse(res.data.config)

      // 2、构建出AV.init
      AV.init({
        appId: appId,
        appKey: appKey,
        masterKey: masterKey
      })  

      // 3、上传文件
      const maps = []
      for(let i = 0; i < files.length; i++) {
        maps.push({ filename: useFileName() + '.' + useGetSuffix(files[i].name), content: files[i] })
      }
      const promise = maps.map(async item => {
        return await new AV.File(item.filename, item.content).save({
          key: path + item.filename,
          useMasterKey: true
        })
      })

      // 4、返回结果
      Promise.all(promise).then(res => {
        resolve(res.map((item: any) => {
          return {
            id: item.id,
            ...item.attributes,
            img_url: path + item.attributes.name
          }
        }))
      })
    })
  },
  deleteFile () {

  },
  updateFile () {

  }
}