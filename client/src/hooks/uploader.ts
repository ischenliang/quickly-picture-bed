import { mimeTypes } from "@/global.config";
import useUserStore from "@/store/user";
import axios from "axios";
import { useFileName } from "./date-time";
import { useFileToBase64, useGetImageSize, useGetSuffix } from "./global";

/**
 * 上传管理器
 */
export default class UploadManager {
  // 上传文件
  uploadFile (id: string, files: File[], progressFn: Function) {
    return new Promise(async (resolve, reject) => {
      const userStore = useUserStore()
      const plugin = userStore.pluginManager.load(id)

      // 2、构建接口地址和formData
      const maps = []
      for(let i = 0; i < files.length; i++) {
        const imageWH: any = await useGetImageSize(files[i])
        const suffix = useGetSuffix(files[i].name)
        maps.push({
          file: files[i],
          filename: useFileName() + '.' + suffix,
          size: files[i].size,
          width: imageWH.width,
          height: imageWH.height,
          mine_type: mimeTypes[suffix]
        })
      }

      // 3、构建formData并上传，并且记录进度
      const promise = maps.map(async (item, index) => {
        const requestConfig = await plugin.uploader.request({ file: item.file, filename: maps[index].filename })
        return await axios({
          ...requestConfig,
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
          const tmp = maps[index]
          return {
            img_width: maps[index].width,
            img_height: maps[index].height,
            img_size: maps[index].size,
            mine_type: maps[index].mine_type,
            img_name: maps[index].filename,
            ...plugin.uploader.response(item, {
              file: tmp.file,
              filename: tmp.filename
            })
          }
        }))
      }).catch(error => {
        console.log(error)
      })
    })
  }
  // 删除文件
  deleteFile () {

  }
  // 更新文件
  updateFile () {

  }
}