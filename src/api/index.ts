import axios, { AxiosRequestConfig } from "axios";

const http = axios.create({
  baseURL: 'http://127.0.0.1:3002/api/v1'
})

http.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers['authorization'] = localStorage.getItem('token')
  return config
}, (error) => {

})
http.interceptors.response.use((response: any) => {
  return Promise.resolve(response.data.data)
}, (error) => {

})

export default http