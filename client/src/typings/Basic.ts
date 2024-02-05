import { baseURL } from '@/global.config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export default class Basic {
  http: AxiosInstance = null
  prefix = ''
  constructor (prefix: string) {
    this.prefix = prefix
    this.http = axios.create({
      baseURL: baseURL
    })
    this.http.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers['authorization'] = localStorage.getItem('token')
      return config
    }, (error) => {

    })
    this.http.interceptors.response.use((response: any) => {
      return Promise.resolve(response.data.data)
    }, (error) => {

    })
  }
}