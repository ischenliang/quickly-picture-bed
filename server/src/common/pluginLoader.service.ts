import { Injectable } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import { FileItem, SandboxInter } from 'src/interface'
import { Plugin } from 'src/plugin/entities/plugin.entity'
import * as vm from 'vm'
import * as fs from 'fs'
import * as path from 'path'
import * as iconv from 'iconv-lite'
const moment = require('moment');
const sizeOf = require('image-size')
var FormData = require('form-data')
const axios = require('axios')
const stream = require('stream')

@Injectable()
export class PluginLoaderService {
  // private plugins: { [name: string]: IPlugin } = {}
  constructor () {
    // 插件列表
    // this.plugins = {}
  }
  // // 插件注册
  // register () {}
  // // 获取插件
  // getPlugin () {}
  // // 卸载插件
  // unregister () {}
  // // 是否拥有插件
  // hasPlugin () {}
  // // 加载本地插件
  // load () {}

  /**
   * 加载插件：构建沙箱环境，还需要考虑其他类型的插件
   * @param plugin 
   * @returns 
   */
  async resolvePlugin (plugin: Plugin): Promise<SandboxInter> {
    const { data: scriptContent } = await axios.get(`${process.env.NPM_REGISTRY}/${plugin.name}/${plugin.version}/files/dist/index.umd.js`)
    // const scriptContent = fs.readFileSync(path.join(__dirname, './plugin.js')).toString()
    // 这里需要注意：如果需要Nodejs其他内置模块功能则需要传入方可使用，否则需要在插件中自行安装其他第三方插件代替
    const sandbox: SandboxInter = {
      Buffer: Buffer, // 插件内部需要使用Buffer功能
      FormData: FormData, // 插件内部需要使用formData
      Error: Error, // 插件内容使用Error
      axios: axios,
      stream: stream,
      fs: fs,
      path: path,
      port: process.env.APP_PORT,
      console: {
        log: (...message) => {
          // 自定义console.log函数，将输出内容传递给回调函数进行处理
          console.log('沙箱输出结果: ', ...message);
        }
      }
    }
    vm.createContext(sandbox)
    vm.runInContext(scriptContent, sandbox)
    return sandbox
  }

  /**
   * 上传文件，即处理成RequestConfig然后调用axios上传，并将结果返回
   * @param sandbox 
   * @param files 
   * @param bucketConfig 
   */
  async upload (sandbox: SandboxInter, files: Array<Express.Multer.File>, bucketConfig: any): Promise<FileItem[] | any> {
    return new Promise(async (resolve, reject) => {
      // 1、构建图片大小和相关信息
      const maps: FileItem[] = []
      for (let i = 0; i < files.length; i++) {
        const { buffer, mimetype, size, originalname } = files[i]
        // 注意: 这里的type获取有问题，出现过png -> jpg
        const { width, height, type } = sizeOf(files[i].buffer)
        maps.push({
          width,
          height,
          name: this.generateFilename() + '.' + this.getSuffix(files[i].originalname),
          buffer: buffer,
          size: size,
          mime_type: mimetype,
          // 这里的originalname会有中文乱码，故使用iconv.decode将其转为utf8编码的中文
          origin_name: iconv.decode(originalname as any, 'utf8') || originalname,
          weight: i
        })
      }
      // 2、处理requestConfig，并构建上传统计
      const config = this.handleBucketConfig(bucketConfig)
      const promises = maps.map(async (item, index) => {
        const requestConfig: AxiosRequestConfig = await sandbox.IPlugin.handler(config, item.buffer, item.name)
        // console.log('请求配置', requestConfig)
        return await axios({
          ...requestConfig,
          // 后续做实时进度处理
        })
      })
      // 3、处理返回结果
      Promise.all(promises).then(res => {
        // 这里再套一层的原因：可能在response中也有异步处理
        Promise.all(res.map(async (item, index) => {
          const { buffer, ...param } = maps[index]
          return await sandbox.IPlugin.response(item.data, param.name, config)
        })).then(res => {
          resolve(res.map((el, index) => {
            const { buffer, ...param } = maps[index]
            return {
              ...param,
              baseurl: config.baseUrl,
              ...el
            }
          }))
        })
      }).catch(async (error) => {
        console.log(error)
        reject(error.response.data)
      })
    })
  }

  /**
   * 处理bucketConfig，即将`${config.xxx}`替换成具体的内容
   * @param config 
   * @returns 
   */
  private handleBucketConfig (config: any) {
    for (let key in config) {
      config[key] = config[key].replace(/\$\{((config).*?)\}/g, (v, key) => {
        const keys = key.split('.')
        if (keys[0] === 'config') {
          return config[keys[1]]
        }
      })
    }
    return config
  }

  /**
   * 生成文件名称
   * @param type 
   * @returns 
   */
  private generateFilename (type = 'random') {
    const randomNum = Math.floor(Math.random() * 900) + 100 // 生成一个3位随机数
    if (type === 'random') {
      return moment(new Date()).format('YYYYMMDDHHmmss') + randomNum + Math.floor(Math.random() * 10)
    }
    if (type === 'timestamp') {
      return moment(new Date()).format('YYYYMMDDHHmmss') + moment().format('x')
    }
    if (type === 'timestampr') {
      return moment().format('x') + randomNum + Math.floor(Math.random() * 10)
    }
  }

  /**
   * 获取文件后缀
   * @param filename 
   * @returns 
   */
  private getSuffix (filename: string) {
    // 获取以identify为标识符的位置
    var index = filename.lastIndexOf('.');
    // 获取后缀
    var value = filename.slice(index + 1);
    return value;
  }
}