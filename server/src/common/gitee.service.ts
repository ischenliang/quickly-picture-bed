import { Injectable } from "@nestjs/common";
const axios = require('axios')

export interface WikiConfig {
  type: 'gitee' | 'github'
  owner: string
  repo: string
  branch: string
  access_token: string
  baseurl: string
}

function resolvePath (path: string) {
  if (path.startsWith('/')) {
    path = path.slice(1)
  }
  if (!path.endsWith('/')) {
    path += '/'
  }
  return path
}

@Injectable()
export class GiteeService {
  constructor () {}

  /**
   * 创建文件
   * @param filename 文件名称
   * @param markdown markdown内容
   */
  createFile (filename: string, markdown: string, config: WikiConfig = {
    type: 'gitee',
    owner: '',
    repo: '',
    branch: '',
    access_token: '',
    baseurl: ''
  }) {
    let path = resolvePath(config.baseurl)
    // 还需要判断当前的类型
    const url = `https://gitee.com/api/v5/repos/${config.owner}/${config.repo}/contents/${path}${filename}`
    const formData = new FormData()
    formData.append('access_token', config.access_token)
    formData.append('content', Buffer.from(markdown || ' ').toString('base64'))
    formData.append('message', `创建文件 ${filename}`)
    formData.append('branch', config.branch || 'master')
    return new Promise((resolve, reject) => {
      return axios({
        url: url,
        method: 'post',
        data: formData,
        headers: {
          Authorization: `token ${config.access_token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }).then(res => {
        resolve(res.data.content)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 更新文件
   * @param filename 文件名称
   * @param markdown markdown内容
   * @returns 
   */
  updateFile (filename: string, markdown: string, sha: string, config: WikiConfig = {
    type: 'gitee',
    owner: '',
    repo: '',
    branch: '',
    access_token: '',
    baseurl: ''
  }) {
    let path = resolvePath(config.baseurl)
    const url = `https://gitee.com/api/v5/repos/${config.owner}/${config.repo}/contents/${path}${filename}`
    const formData = new FormData()
    formData.append('access_token', config.access_token)
    formData.append('content', Buffer.from(markdown || ' ').toString('base64'))
    formData.append('sha', sha)
    formData.append('message', `更新文件 ${filename}`)
    formData.append('branch', config.branch || 'master')
    return new Promise((resolve, reject) => {
      return axios({
        url: url,
        method: 'put',
        data: formData,
        headers: {
          Authorization: `token ${config.access_token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }).then(res => {
        resolve(res.data.content)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 删除文件
   * @param filename 
   * @param sha 
   * @returns 
   */
  deleteFile (filename: string, sha: string, config: WikiConfig = {
    type: 'gitee',
    owner: '',
    repo: '',
    branch: '',
    access_token: '',
    baseurl: ''
  }) {
    let path = resolvePath(config.baseurl)
    const url = `https://gitee.com/api/v5/repos/${config.owner}/${config.repo}/contents/${path}${filename}`
    const formData = new FormData()
    formData.append('access_token', config.access_token)
    formData.append('sha', sha)
    formData.append('message', `删除文件 ${filename}`)
    formData.append('branch', config.branch || 'master')
    return new Promise((resolve, reject) => {
      return axios({
        url: url,
        method: 'delete',
        data: formData,
        headers: {
          Authorization: `token ${config.access_token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }).then(res => {
        resolve(res.data.content)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 获取文件内容
   * @param filename 
   * @returns 
   */
  getFile (filename: string, config: WikiConfig = {
    type: 'gitee',
    owner: '',
    repo: '',
    branch: '',
    access_token: '',
    baseurl: ''
  }) {
    let path = resolvePath(config.baseurl)
    const url = `https://gitee.com/api/v5/repos/${config.owner}/${config.repo}/contents/${path}${filename}?access_token=${config.access_token}&ref=${config.branch || 'master'}`
    return new Promise((resolve, reject) => {
      return axios({
        url: url,
        method: 'get',
        headers: {
          Authorization: `token ${config.access_token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }).then(res => {
        resolve(res.data.content)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 链接测试
   * @param config 
   * @returns 
   */
  connectTest (config: WikiConfig): Promise<any[]> {
    if (config.type === 'gitee') {
      // 还需要判断当前的类型
      const url = `https://gitee.com/api/v5/repos/${config.owner}/${config.repo}/branches?access_token=${config.access_token}`
      return new Promise((resolve, reject) => {
        return axios({
          url: url,
          method: 'get'
        }).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}