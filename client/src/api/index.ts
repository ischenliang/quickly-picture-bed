import axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import useUserStore from "@/store/user";

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3002/api/v1'
})

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers['authorization'] = localStorage.getItem('token')
  return config
}, (error) => {

})
instance.interceptors.response.use((response: any) => {
  if (response.data.code === 200) {
    return Promise.resolve(response.data.data)
  } else {
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
      ElMessage({ message: error.message, type: 'error' })
      if (error.code === 401) {
        localStorage.clear()
        useUserStore().updateUserInfo(null)
        router.push({
          path: '/login'
        })
      }
    })
  })
}

export default http