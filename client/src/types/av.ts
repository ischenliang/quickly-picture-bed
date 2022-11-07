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