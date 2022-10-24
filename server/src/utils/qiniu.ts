import { QiniuUploadConfig, QiniuFileManager } from '@/types'
import qiniu from 'qiniu'


/**
 * 获取七牛上传凭证token
 * @param config 上传配置
 * @returns uploadToken(上传凭证)
 */
export function getUploadToken (config: QiniuUploadConfig) {
  const { accessKey, secretKey, bucket, expires } = config
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    expires: expires
  })
  const uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}

/**
 * 删除七牛云空间的文件
 * @param config 配置
 * @param fileName 文件(需带路径)
 * @returns 
 */
export function deleteFile (config: QiniuFileManager) {
  const { accessKey, secretKey, bucket, expires, fileName } = config
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const qiniuConfig = new qiniu.conf.Config()
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig)
  return new Promise((resolve, reject) => {
    bucketManager.delete(bucket, fileName, (error, res, resInfo) => {
      if (error || resInfo.statusCode !== 200) {
        reject(resInfo.data)
      } else {
        resolve(resInfo)
      }
    })
  })
}