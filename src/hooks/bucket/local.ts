import { useCurrentUser, useGetImageSize } from "../global"
import AV from 'leancloud-storage'
import { useFormatRes } from "../fetch"
import Image from "@/types/Image"

/**
 * 本地存储桶图床配置
 */
const baseUrl = 'http://lc-DZNcsGI3.cn-n1.lcfile.com'
const image = new Image()
export default {
  uploadFile (files: File[]) {
    return new Promise((resolve, reject) => {
      const maps = []
      for(var i = 0; i < files.length; i++) {
        maps.push(files[i])
      }
      const promise = maps.map(item => {
        const file = new AV.File(item.name, item)
        return file.save()
      })
      Promise.all(promise).then(res => {
        const resPromise = res.map(async item => {
          let { data: { url, name, mime_type, metaData: { size } } } = useFormatRes(item)
          return await image.create({
            img_name: name,
            img_width: 1920,
            img_height: 1080,
            mine_type: mime_type,
            img_size: size,
            img_url: url.replace(new RegExp(baseUrl, 'g'), ''),
            bucket_id: '633e967b31a5a915d52901be',
            bucket_type: 'local',
            uid: useCurrentUser().id
          })
        })
        Promise.all(resPromise).then(subRes => {
          resolve(subRes)
        })
      })
    })
  },
  deleteFile () {

  },
  updateFile () {

  }
}