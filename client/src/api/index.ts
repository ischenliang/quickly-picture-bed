import axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import useUserStore from "@/store/user";
import { baseURL } from "@/global.config";

const instance = axios.create({
  baseURL: baseURL
})

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const { notAuth = false } = config.headers
  if (!notAuth) {
    config.headers['authorization'] = localStorage.getItem('token')
  }
  delete config.data.notAuth
  return config
}, (error) => {

})
instance.interceptors.response.use((response: any) => {
  if (response.data.code === 200) {
    return Promise.resolve(response.data.data)
  }else {
    return Promise.reject(response.data)
  }
}, (error) => {

})

function http (url, data) {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: 'post',
      data
    }).then((res: any) => {
      resolve(res)
    }).catch(error => {
      console.log('报错了: ', error)
      if ([201].includes(error.code)) {
        reject(error)
      } else {
        ElMessage({ message: error.data || error.message, type: 'error' })
        if ([401].includes(error.code)) {
          // 为了避免由于登录失效后到登录页还需重新输入数据
          const email = localStorage.getItem('email')
          const password = localStorage.getItem('password')
          localStorage.clear()
          localStorage.setItem('email', email)
          localStorage.setItem('password', password)
          useUserStore().updateUserInfo(null)
          router.push({
            path: '/login'
          })
        }
      }
    })
  })
}

export default http