import axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import useUserStore from "@/store/user";
import { baseURL } from "@/global.config";

const instance = axios.create({
  baseURL: baseURL
})

instance.interceptors.request.use((config: any) => {
  const { notAuth = false } = config.headers
  if (!notAuth) {
    config.headers['authorization'] = 'Bearer ' + localStorage.getItem('token')
  }
  delete config.data.notAuth
  return config
}, (error) => {

})
instance.interceptors.response.use((response: any) => {
  if (response.data.code === 200) {
    return Promise.resolve(response.data.data)
  } else {
    if ([50001].includes(response.data.code)) {
      return Promise.reject(response.data)
    }
    return Promise.reject(response.data)
  }
}, (error) => {
  console.log(error)
  if (error.response.status === 401) {
    return Promise.reject(error.response.data)
  }
})

function http (url, data, progressFn: Function = () => {}) {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: 'post',
      data,
      // 进度监测
      onUploadProgress (e) {
        progressFn({
          loaded: e.loaded,
          total: e.total,
          percent: parseFloat((e.progress * 100).toFixed(2))
        })
      }
    }).then((res: any) => {
      resolve(res)
    }).catch(error => {
      console.log('报错了: ', error)
      if ([50001].includes(error.code)) {
        return reject(error)
      }
      if (['/login', '/register', '/forget', '/tool/smsSend'].includes(url) || [201].includes(error.code)) {
        reject({ message: error.data || error.message, type: 'error' })
      } else {
        ElMessage({ message: error.data || error.message, type: 'error' })
        if ([401].includes(error.code) || (error.code === 500 && error.message === 'invalid token')) {
          // 为了避免由于登录失效后到登录页还需重新输入数据
          localStorage.removeItem('token')
          useUserStore().resetData()
          router.push({
            path: '/login'
          })
        }
      }
    })
  })
}

export default http