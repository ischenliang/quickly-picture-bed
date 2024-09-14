import { useFileToBase64, useGetImageSize, useGetSuffix } from "../global"
import moment from 'moment'
import axios from 'axios'
import Bucket from "@/types/Bucket"
import { useFileName } from "../date-time"
import { mimeTypes } from "@/global.config"

/**
 * gitee存储桶图床配置
 */
const baseUrl = 'https://gitee.com/api/v5/repos/'
const bucket = new Bucket()
export default {
  /**
   * 上传文件
   * 原理：
   *    1、根据bucket_id获取存储桶配置
   *        还需要获取用户的习惯
   *    2、拿到存储桶配置后构建出接口地址和formData
   *        由于gitee不支持直接上传文件，所以需要转换成base64
   *    3、最后使用axios调用接口
   *    4、将结果数据返回
   * @param bucket_id 存储桶id
   * @param files 文件列表
   */
  uploadFile (bucket_id: string, files: File[], progressFn: Function) {
    return new Promise(async (resolve, reject) => {
      // 1、获取存储桶配置
      const res: any = await bucket.detail(bucket_id)
      const { username, repo, branch, token, path, customPath, commit_messages } = JSON.parse(res.config)

      // 2、构建接口地址和formData
      const maps = []
      for(let i = 0; i < files.length; i++) {
        const imageWH: any = await useGetImageSize(files[i])
        const suffix = useGetSuffix(files[i].name)
        maps.push({
          filename: useFileName() + '.' + suffix,
          content: await useFileToBase64(files[i]),
          size: files[i].size,
          width: imageWH.width,
          height: imageWH.height,
          mine_type: mimeTypes[suffix]
        })
      }
      
      // 3、构建formData并上传
      const promise = maps.map(async (item, index) => {
        let url = `${baseUrl}${username}/${repo}/contents/${path}/` + item.filename
        const formData = new FormData()
        formData.append('branch', branch)
        formData.append('content', item.content)
        formData.append('access_token', token)
        formData.append('message', commit_messages)
        return await axios({
          url,
          method: 'POST',
          data: formData,
          // 进度监测
          onUploadProgress (e) {
            progressFn({
              index: index,
              loaded: e.loaded,
              total: e.total,
              percent: parseFloat((e.progress * 100).toFixed(2)),
            })
          }
        })
      })


      // 4、返回结果
      Promise.all(promise).then(res => {
        resolve(res.map((item, index) => {
          const tmp = item.data.content
          return {
            img_name: tmp.name,
            img_url: tmp.path,
            img_width: maps[index].width,
            img_height: maps[index].height,
            img_size: maps[index].size,
            mine_type: maps[index].mine_type,
            hash: tmp.sha
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