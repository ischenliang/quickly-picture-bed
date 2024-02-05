import { baseURL } from '@/global.config';
import axios from 'axios'
import AV from 'leancloud-storage'
export function initAv() {
  AV.init({
    appId: "DZNcsGI3WVFNYIVdNCUUHeRy-gzGzoHsz",
    appKey: "iqy1M0UHQ2kqqBWT2VSUNbRO",
    serverURL: "https://dzncsgi3.lc-cn-n1-shared.com"
  })
}

/**
 * 上传图片
 * @param filename 文件名称
 * @param file 文件
 * @returns 
 */
export function uploadImg (filename: string, file: File) {
  initAv()
  return new AV.File(filename, file).save()
}


/**
 * 上传图片到本地
 * @param filename 文件名称 
 * @param file 文件
 */
export function uploadImgLocal (filename: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', 'album-1ba162b3/41d7b6cf391f-' + filename)
  return axios({
    url: baseURL + '/tool/upload',
    method: 'post',
    data: formData
  })
}