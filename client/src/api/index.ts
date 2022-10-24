import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3002/api/v1'
})

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers['authorization'] = localStorage.getItem('token')
  return config
}, (error) => {

})
instance.interceptors.response.use((response: any) => {
  return Promise.resolve(response.data.data)
}, (error) => {

})

function http (url, data) {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: 'post',
      data
    }).then(res => {
      resolve(res)
    }).catch(error => {
      console.log('报错了: ', error)
    })
  })
}

export default http