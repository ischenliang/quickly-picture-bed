import { AxiosRequestConfig } from "axios"

// 插件配置项items项
interface IPluginLabelOption {
  label: string
  value: string | number | boolean
}
// 插件配置项
export interface IPluginConfig {
  type: "string" | "password" | "option" | "choice" // 字段类型
  label: string // 表单提示文字
  field: string // 生成节点key名称
  default: string | number | boolean // 默认值
  required?: boolean // 是否必填项，为true时会经过校验
  placeholder?: string // 输入框提示文字
  tips?: string // 填写时的底部提示
  hidden?: boolean // 是否隐藏当前节点
  options?: Array<IPluginLabelOption> // 下拉框选择项
  choices?: {
    active: IPluginLabelOption // 打开时显示的内容
    inactive: IPluginLabelOption // 关闭时显示的内容
  }
}
// 插件
export interface IPlugin {
  config: Array<IPluginConfig> // 界面呈现config
  handler: (config: any, file: any, filename: string) => AxiosRequestConfig // 上传处理
  response: (result: any, filename: string, config: any) => any // 结果处理
  [propName: string]: any
}

// 沙箱
export interface SandboxInter {
  Buffer: any // 插件内部需要使用Buffer功能
  FormData: any // 插件内部需要使用formData
  Error: any // 插件内部需要使用的Error对象
  axios: any // 插件内部需要使用的Axios对象
  path: any // 插件内部需要使用的path对象
  stream: any // 插件内部需要使用的stream对象
  fs: any // 插件内部需要使用fs对象
  port: string | number // 程序占用端口
  console: any // 自定义console.log函数，将输出内容传递给回调函数进行处理
  IPlugin?: IPlugin
}
// 文件item
export interface FileItem {
  width: number
  height: number
  name: string
  buffer: any
  size: number
  mime_type: string
  origin_name: string
  weight: number
  baseurl?: string
  img_url?: string
  code?: number // 用于在插件内部做验证
  message?: string // 用于在插件内部做验证
}