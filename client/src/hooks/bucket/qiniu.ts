import { useGetImageSize, useGetSuffix } from "../global"
import moment from "moment"
import Bucket from "@/types/Bucket"
import axios from "axios"
import * as qiniu from 'qiniu-js'
import { useFileName } from "../date-time"
import { mimeTypes } from "@/global.config"
import http from '@/api'

// const http = (url, method = 'POST', data = null) => {
//   return new Promise((resolve, reject) => {
//     axios({ url, method, data }).then(res => {
//       resolve(res.data)
//     }).catch(error => {
//       // 抛出错误异常
//     })
//   })
// }

const regions = {
  'qiniu.region.z0': qiniu.region.z0,
  'qiniu.region.z1': qiniu.region.z1,
  'qiniu.region.z2': qiniu.region.z2
}

/**
 * 七牛上传文件
 * @param file File文件
 * @param fileName 文件名称(带路径), 为 null 或者 undefined 时则自动使用文件的 hash 作为文件名
 * @param token 上传凭证
 * @param config 其中的每一项都为可选
 */
const upload = (file: File, fileName, token, region: string, index, progressFn: Function) => {
  return new Promise((resolve, reject) => {
    const observable = qiniu.upload(file, fileName, token, {}, {
      region: regions[region]
    })
    observable.subscribe({
      next (e) {
        progressFn({
          index,
          loaded: e.total.loaded,
          total: e.total.size,
          percent: e.total.percent
        })
      },
      error (err) {
        // 错处处理
      },
      complete (res) {
        resolve(res)
      }
    })
  })
}

/**
 * 七牛存储桶图床配置
 */
// const service_url = 'http://demo.itchenliang.club' // 后台接口地址
const bucket = new Bucket()

export default {
  /**
   * 上传文件
   * 原理：
   *    1、根据bucket_id获取存储桶的配置
   *    2、拿到存储桶配置后调用demo.itchenliang.club上的qiniu/sign接口获取上传凭证
   *    3、拿到上传凭证后上传文件，上传成功后将数据返回
   * @param bucket_id 存储桶id
   * @param files 文件列表
   */
  uploadFile (bucket_id: string, files: File[], progressFn: Function) {
    return new Promise(async (resolve, reject) => {
      // 1、获取存储桶配置
      const res: any = await bucket.detail(bucket_id)
      const { accessKey, secretKey, bucket_name, area, domain, suffix, path } = JSON.parse(res.config)

      // 2、获取上传凭证
      const httpRes: any = await http('/tool/qiniuSign', {
        accessKey,
        secretKey,
        bucket: bucket_name,
        expires: 7200
      })
      const uploadToken = httpRes.token

      // 3、上传文件
      const maps = []
      for (let i = 0; i < files.length; i++) {
        const imageWH: any = await useGetImageSize(files[i])
        const suffix = useGetSuffix(files[i].name)
        maps.push({
          filename: path + useFileName() + '.' + suffix,
          file: files[i],
          size: files[i].size,
          width: imageWH.width,
          height: imageWH.height,
          mine_type: mimeTypes[suffix]
        })
      }
      const promise = maps.map(async (item, index) => {
        return await upload(item.file, item.filename, uploadToken, area, index, progressFn)
      })

      // 4、返回结果
      Promise.all(promise).then(res => {
        resolve(res.map((item: any, index) => {
          const name = item.key.replace(new RegExp(path), '')
          return {
            img_name: suffix ? name + '?' + suffix : name,
            img_url: item.key,
            img_width: maps[index].width,
            img_height: maps[index].height,
            img_size: maps[index].size,
            mine_type: maps[index].mine_type,
            hash: item.hash
          }
        }))
      })
    })
  },
  /**
   * 删除文件
   * 由于七牛无法在客户端删除文件，所以调用demo.itchenliang.club的接口来删除
   * 原理：
   *    1、根据image_id获取详情，例如bucket_id、img_url
   *    2、拿到bucket_id后获取存储桶配置
   *        查询到：执行3、4操作
   *        未查询到配置：直接执行4操作
   *    3、拿到存储桶配置后调用demo.itchenliang.club来删除七牛上的文件
   *    4、删除成功后再将leancloud上的当前这条数据删除
   * @param image_id 图片id
   */
  deleteFile (image_id: string) {

  },
  updateFile () {

  }
}