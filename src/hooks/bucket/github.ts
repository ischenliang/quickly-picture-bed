import Bucket from "@/types/Bucket"
import { useFileName } from "../date-time"
import { useFileToBase64, useGetImageSize, useGetSuffix } from "../global"
import axios from 'axios'

/**
 * Github存储桶图床配置
 */
const baseUrl = 'https://api.github.com/repos/'
const bucket = new Bucket()
export default {
  /**
   * 文件上传
   * 原理：
   *    1、根据bucket_id获取存储桶配置
   *        还需要获取用户的习惯
   *    2、拿到存储桶配置后构建出接口地址和formData
   *        由于github不支持直接上传文件，所以需要转换成base64
   *    3、最后使用axios调用接口
   *    4、将结果数据返回
   * @param bucket_id 存储桶id
   * @param files 文件列表
   * @returns 
   */
  uploadFile (bucket_id: string, files: File[]) {
    return new Promise(async (resolve, reject) => {
      // 1、获取存储桶配置
      const res: any = await bucket.detail(bucket_id)
      const { username, repo, branch, token, path, domain, commit_messages } = JSON.parse(res.data.config)

      // 2、构建接口地址和formData
      const maps = []
      for(let i = 0; i < files.length; i++) {
        maps.push({ filename: useFileName() + '.' + useGetSuffix(files[i].name), content: await useFileToBase64(files[i]) })
      }
      
      // 3、构建formData并上传
      const promise = maps.map(async item => {
        let url = `${baseUrl}${username}/${repo}/contents/${path}` + item.filename
        return await axios({
          url,
          method: 'PUT',
          data: {
            branch,
            content: item.content,
            message: commit_messages
          },
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json'
          }
        })
      })

      // 4、返回结果
      Promise.all(promise).then(res => {
        resolve(res.map(item => {
          return item.data.content
        }))
      })
    })
  },
  deleteFile () {

  },
  updateFile () {

  }
}