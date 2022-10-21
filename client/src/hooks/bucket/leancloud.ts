import Bucket from "@/types/Bucket"
import { useGetImageSize, useGetSuffix } from "../global"
import AV from 'leancloud-storage'
import { useFileName } from "../date-time"
import { mimeTypes } from "@/global.config"
import { id } from "element-plus/es/locale"

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
  uploadFile (bucket_id: string, files: File[], progressFn: Function) {
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
        const imageWH: any = await useGetImageSize(files[i])
        const suffix = useGetSuffix(files[i].name)
        maps.push({
          filename: useFileName() + '.' + suffix,
          content: files[i],
          size: files[i].size,
          width: imageWH.width,
          height: imageWH.height,
          mine_type: mimeTypes[suffix]
        })
      }
      const promise = maps.map(async (item, index) => {
        return await new AV.File(item.filename, item.content).save({
          key: path + item.filename,
          useMasterKey: true,
          onprogress: (progress) => {
            progressFn({
              loaded: progress.loaded,
              total: progress.total,
              percent: progress.percent,
              index: index // 文件对应的索引
            })
          }
        })
      })

      // 4、返回结果
      Promise.all(promise).then(res => {
        resolve(res.map((item: any, index) => {
          const tmp = item.attributes
          return {
            img_name: tmp.name,
            img_url: path + tmp.name,
            img_width: maps[index].width,
            img_height: maps[index].height,
            img_size: maps[index].size,
            mine_type: maps[index].mine_type,
            hash: item.id
          }
        }))
      })
    })
  },
  /**
   * 删除文件
   *    1、根据bucket_id获取存储桶配置
   *    2、拿到存储桶配置后构建AV.init
   *    3、最后使用AV.File.createWithoutData和file.destroy()删除文件
   *    4、返回删除成功
   */
  deleteFile (bucket_id: string, ids: string[]) {
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

      // const file = AV.File.createWithoutData(ids)
      // file.destroy().then(res => {
      //   resolve({ code: 200, msg: '删除成功' })
      // })

      // 3、删除文件
      const promise = ids.map(async (item, index) => {
        const file = AV.File.createWithoutData(item)
        return await file.destroy()
      })

      // 4、返回结果
      Promise.all(promise).then(res => {
        resolve({
          code: 200,
          msg: '删除成功'
        })
      })
    })
  },
  updateFile () {

  }
}