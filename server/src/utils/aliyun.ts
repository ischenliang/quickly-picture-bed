import { AliUploadConfig, TencentUploadConfig, UpyunUploadConfig } from '@/types'
import { useGetSuffix } from './global'
import crypto from 'crypto'
import MD5 from 'md5'

export function getSingnature (config: AliUploadConfig) {
  // const date = new Date((new Date().getTime() + 300000)).toUTCString()
  // const mine_type = useGetSuffix(config.filename)
  // const sigStr = `PUT\n\n${mine_type}\n${date}\n/${config.bucket}/${config.path}/${config.filename}`
  // const signature = crypto.createHmac('sha1', config.accessKeySecret).update(sigStr).digest('base64')
  // return signature


  const expireTime = new Date().getTime() + 300000
  const expiration = new Date(expireTime).toISOString()

  const policyString = JSON.stringify({
    expiration,
    conditions: [
      ['content-length-range', 0, 1048576000],
      ['starts-with', '$key', config.path]
    ]
  })
  const policy = Buffer.from(policyString).toString('base64')
  const signature = crypto.createHmac('sha1', config.accessKeySecret).update(policy).digest("base64")
  return {
    policy,
    signature
  }
}


export function getCosSignature (config: TencentUploadConfig) {
  const today = Math.floor(new Date().getTime() / 1000)
  const tomorrow = today + 86400
  let signTime = `${today};${tomorrow}`
  const signKey = crypto.createHmac('sha1', config.secretKey).update(signTime).digest('hex')
  const httpString = `put\n/${config.path}${config.filename}\n\nhost=${config.bucket}.cos.${config.area}.myqcloud.com\n`
  const sha1edHttpString = crypto.createHash('sha1').update(httpString).digest('hex')
  const stringToSign = `sha1\n${signTime}\n${sha1edHttpString}\n`
  const signature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex')
  return {
    signature,
    signTime
  }
}


// export function getUpyunSignature (config: UpyunUploadConfig) {
//   const operator = config.operator
//   const password = MD5(config.password)
//   const date = new Date().toUTCString()
//   const uri = `/${config.bucket}/${config.path}${config.filename}`
//   const value = `PUT&${uri}&${date}`
//   const sign = crypto.createHmac('sha1', password).update(value).digest('base64')
//   return {
//     signature: `UPYUN ${operator}:${sign}`
//   }
// }

export function getUpyunSignature (config: UpyunUploadConfig) {
  const today = new Date()
  const policyString = JSON.stringify({
    bucket: config.bucket,
    'save-key': config.path + config.filename,
    expiration: new Date(today.getTime() + 86400).toUTCString(),
    date: today.toUTCString(),
    'content-md5': config.md5
  })
  const policy = Buffer.from(policyString).toString('base64')
  const uri = `/${config.bucket}/${config.path}${config.filename}`
  const value = `PUT&${uri}&${today}&${policy}`
  const password = MD5(config.password)
  const signature = crypto.createHmac('sha1', password).update(value).digest("base64")
  return {
    signature: `UPYUN ${config.operator}:${signature}`
  }
}