import { useCurrentUser } from '@/hooks/global';
import { useFormatRes } from '@/hooks/fetch';
import Image from '@/types/Image';
import AV from 'leancloud-storage'
import moment from 'moment'
import axios from 'axios'


function useFileToBase64 (file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result: any = reader.result
      resolve(result.split(",").pop())
    };
    reader.onerror = (error) => {
      reject(error)
    };
  });
}


function useGetSuffix (filePath, identify) {
  // 获取以identify为标识符的位置
  var index = filePath.lastIndexOf(identify);
  // 获取后缀
  var value = filePath.substr(index + 1);
  return value;
}

// 文件名称：时间 + 时间戳
// const fileName = moment().format('YYYYMMDDHHmmss') + moment().format('x')

// 文件名称: 时间 + 随机数
const fileName = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 10 + 1)

const baseUrl = 'http://lc-DZNcsGI3.cn-n1.lcfile.com'

/**
 * 本地存储桶
 */
const image = new Image()
export function useLocalBucket (files: File[]) {
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
}


/**
 * 七牛存储桶
 */
export function useQiniuBucket () {

}

/**
 * Gitee存储桶
 */
export function useGiteeBucket (config, files: File[]) {
  return new Promise(async (resolve) => {
    const { username, repo, branch, token, path, customPath, commit_messages } = config
    const maps = []
    for(var i = 0; i < files.length; i++) {
      maps.push({
        filename: files[i].name,
        content: await useFileToBase64(files[i])
      })
    }
    const promise = maps.map(async item => {
      let url = `https://gitee.com/api/v5/repos/${username}/${repo}/contents/${path}`;
      url += '/2022/10/' + moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 10 + 1) + '.' + useGetSuffix(item.filename, '.')
      const formData = new FormData()
      formData.append('branch', branch)
      formData.append('content', item.content)
      formData.append('access_token', token)
      formData.append('message', commit_messages)
      return await axios({
        url,
        method: 'POST',
        data: formData
      })
    })
    Promise.all(promise).then(res => {
      resolve(res.map(item => {
        return item.data
      }))
    })
  })
}

/**
 * Github存储桶
 */
export function useGithubBucket () {

}

/**
 * Leancloud存储桶
 */
export function useLeancloudBucket () {

}



/**
 * 腾讯COS存储桶
 */
export function useCosBucket () {

}




/**
 * 阿里云OSS存储桶
 */
export function useOssBucket () {

}




/**
 * 又拍云USS存储桶
 */
export function useUssBucket () {

}




/**
 * 华为云OBS存储桶
 */
export function useOBSBucket () {

}