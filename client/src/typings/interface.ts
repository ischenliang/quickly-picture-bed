import { BucketSourceEnum } from "./enum"
import { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'

export interface TableColumnConfig {
  align: string // 对齐方式：center、left、right
  label: string // 列的标题
  width: string // 列的宽度
  prop: string // 列的字段名
  slot?: string // 是否开启插槽
}

// 通用表格列表list数据
export interface ListInter<T, D = any, G = any> {
  page?: number // 页码
  size?: number // 每页显示数量
  total?: number // 总计条数
  loading?: boolean // 加载中
  filters?: { // 筛选条件
    [prop: string]: any
  }
  data: Array<T>
  config?: Array<TableColumnConfig>
  stats?: Array<D>
  versions?: Array<G>
}



/**
 * 存储源实体
 */
// 存储桶配置类型
export interface BucketSourceConfig {
  // 配置描述
  label: string
  // 配置最后映射的键名
  field: string
  // 配置类型：可选string、options
  type: string
  // 配置是否必填项
  required?: boolean
  // 配置对应的选择，只有当type为options时才有该属性
  // 对应Dict中的code字段
  options?:  Array<{
    label: string
    value: any
  }>
  // 当type等于choice时需配置该选项
  choices?: {
    [key in 'active' | 'inactive']: {
      label: string
      value: string | boolean | number
    }
  }
  // 用户输入时的说明
  placeholder?: string
  // 默认值
  default?: any
  // 用户输入提示说明
  tips?: string
  // 是否隐藏不可见
  hidden?: boolean
  // 是否可用
  disabled?: boolean
}
// 存储桶的存储源：即管理员对存储桶进行配置
export interface BucketSourceInter {
  // 存储源id
  id?: string
  // 存储源名称
  name?: string
  // 存储源类型: 存储源对应的类别,例如：qiniu、oss
  type?: string
  // 存储源配置，界面上需要提供可以拖拽调整顺序
  // config?: Array<BucketSourceConfig>
  config?: string
  // 存储源配置字符串
  config_str?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 备注说明
  remark?: string
  // 版本
  version?: string
}
// 存储桶的存储源历史记录：即存储桶源更新时自动记录更新版本
export interface BucketSourceHistoryInter {
  // 存储源版本id
  id?: string
  // 存储源id
  bs_id?: string
  // 存储源配置，界面上需要提供可以拖拽调整顺序
  config?: string
  // 存储桶配置老数据
  config_old?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 最新版本号
  version?: string
  // 旧版本号
  version_old?: string
  // 备注说明
  remark?: string
}

/**
 * 图片实体
 */
export interface ImageInter {
  // 图片id
  id?: string
  // 图片名称
  img_name?: string
  // 图片宽度
  img_width?: number
  // 图片高度
  img_height?: number
  // 文件类型
  mine_type?: string
  // 图片url
  img_url?: string
  // 图片预览地址
  img_preview_url?: string
  // 图片大小
  img_size?: number
  // 存储桶id
  bucket_id?: string
  // 相册id
  album_id?: string
  // 存储桶类型
  bucket_type?: string
  // hash值：用于后续更新时使用
  hash?: string
  // 用户id
  uid?: string
  // 排序值
  // sort?: number
  // 是否选中
  checked?: boolean
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 是否静态更新
  slient?: boolean
  // 排序值
  sort?: number
  // 是否置顶
  top?: boolean | number
  // 标签
  tags?: string[]
  // 原始名称
  img_origin_name?: string
  // 顺序
  order?: number
}


/**
 * 用户实体
 */
export interface UserInter {
  // 用户id
  id?: string
  // 用户名
  username?: string
  // 用户密码
  password?: string
  // 用户邮箱
  email?: string
  // 邮箱是否已验证
  emailVerified?: boolean
  // 用户的手机号
  phone?: string
  // 手机号是否已验证
  mobilePhoneVerified?: boolean
  // 头像: 从给定的一组图片中选择
  avatar?: string
  // 职业
  major?: string
  // 性别
  gender?: string
  // 自我介绍
  desc?: string
  // 联系地址
  address?: string[]
  // 角色
  role?: number | string
  // 角色名称
  role_name?: string
  // 状态: 根据用户来判断是否启用或者禁用
  status?: boolean
  // 加入方式
  // join_type?: number
  // 注册时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 配置
  config?: {
    chatgpt: boolean // 是否可以使用chatgpt
  }
}

/**
 * 日志管理 | 动态管理
 */
export interface LogInter {
  // 日志id
  id?: string
  // 操作类别 1-图片操作，2-系统操作
  type?: number
  // 操作id，系统操作：“四川省成都市”(ip定位)，图片操作：“ID:2366”(文件id)
  operate_id?: string
  // 操作记录，系统操作：“218.88.53.138”(ip)，图片操作：“ab346d65ff689e44.jpg”(文件名称)
  operate_cont?: string
  // 操作内容，系统操作：登录了系统，图片操作：上传了图片
  content?: string
  // 操作时间，如：2022-09-19 17:51:33
  createdAt?: string
  // 操作人，用户id
  uid?: string
  // 客户端信息
  client_info?: {
    province: string // 省份
    city: string // 城市
    adcode: string // 城市代码
    rectangle: string // 经纬度
    ip: string // ip地址
  }
}


/**
 * 存储桶管理
 */
export interface BucketInter {
  // 存储桶
  id?: string
  // 存储桶类别
  type?: string
  // 存储桶标签：从存储源获取
  tag?: string
  // 存储桶名称
  name?: string
  // 存储桶配置
  config?: string
  // 存储桶基地址：方便渲染时使用
  config_baseUrl?: string
  // 是否在上传区域显示
  visible?: boolean
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 操作人，用户id
  uid?: string
  // 插件代码
  plugin?: string
  // 版本号
  version?: string
}


/**
 * 字典管理
 */
export interface DictInter {
  // 字典id
  id?: string
  // 字典名称
  name?: string
  // 字典编码：唯一
  code?: string
  // 字典内容
  values?: Array<{
    label: string
    value: string | number | boolean
    color?: string
  }>
  // 字典内容字符串
  values_str?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}


/**
 * 设置管理
 */
export interface SettingInter {
  // 设置id
  id?: string
  // 设置-网站信息
  website?: {
    logo?: string // logo
    logo_preview?: string
    ico?: string // ico
    ico_preview?: string
    name?: string // 名称
    title?: string // 标题
    subtitle?: string // 副标题
    domain?: string // 域名
    desc?: string // 描述
    keys?: Array<string> // 关键词
    author?: string // 作者
    version?: string // 版本号
    // 打赏
    // 支付宝打赏二维码
    reward_alipay?: string
    reward_alipay_preview?: string
    // 微信打赏二维码
    reward_weixin?: string
    reward_weixin_preview?: string
    // 静态文件前缀
    baseUrl?: string
  }
  // 联系我们
  contact?: {
    // 微信
    weixin?: string
    // QQ
    qq?: string
    // github
    github?: string
    // gitee
    gitee?: string
    // 邮箱
    email?: string
    // qq群
    qq_group?: string
    // 关于我们内容, markdown内容，存储到markdown文件中
    about?: string
  }
  // 系统配置
  system?: {
    // 上传配置
    // 可以上传的文件类型，例如['png', 'jpeg', 'mp4', 'flv', 'webp']
    accept?: Array<string>
    // 可以上传的文件类型的字符串即 accept.join(',.')
    accept_str?: string
    // 单个文件最大容量
    maxsize?: number
    // 单次最多勾选多少文件
    maxcount?: number
    // 存储桶容量限制
    storage_size?: number
    // 存储桶数量限制
    storage_count?: number

    // 图标配置
    icon_url?: string // 图标url
    icon_prefix?: string // 图标前缀
    icon_font?: string // 图标字体

    // 版权配置
    copyright_company?: string // 版权归属公司名称
    copyright_time?: string // 网站运行时间
    copyright_miitbeian?: string // 工信部备案号
    // 工信部备案地址(即工信部官网地址https://beian.miit.gov.cn/)
    copyright_miiturl?: string

    // 地图配置
    map_type?: string // 地图类型
    map_key?: string // 对应的秘钥

    // 邮件服务配置
    mail_user?: string // 发件人
    mail_pass?: string // 授权码
  }
  // 插件配置
  plugin?: {
    default: string // 插件默认格式
  }
  // 更新日志
  uplog?: string // 更新日志url
  // 存储桶后台服务配置
  // Array<{
  //   label: string
  //   link: string
  //   target: string
  // }> | string
  bucket_service?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}


/**
 * 使用习惯管理
 */
export interface HabitsInter {
  // 习惯id
  id?: string
  // 习惯用户id
  uid?: string
  // 快捷键配置: 类似于vscode
  shortKey?: Array<{
    label: string, // 快捷键描述
    key: string // 快捷键code
    value: string // 快捷键内容：Command + Shift + P 
    id: number // 快捷键id
  }>
  // 上传提示
  showUpdateTip?: boolean
  // 复制提示
  showCopyTip?: boolean
  // 删除提示
  showDeleteTip?: boolean
  // 上传前重命名
  rename?: boolean
  // 时间戳重命名
  autoRename?: boolean
  // 上传后自动复制图片地址类型，支持：url、markdown
  pasteStyle?: string
  // 上传后自动复制图片地址
  autoPaste?: boolean
  // 当前使用图床id
  current?: BucketInter
  // 当前使用相册id
  current_album?: string
  // 链接格式，默认是 ![]($url)
  // 占位符$url表示图片url位置
  // 占位符$fileName表示文件名
  link_format?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}


/**
 * 图形验证码
 */
export interface VerifyCodeInter {
  id?: string
  code?: string
  last_id?: string
}


/**
 * 相册
 */
export interface AlbumInter {
  id?: string // 验证码id
  uid?: string // 相册拥有者
  name?: string // 相册名称
  desc?: string // 相册描述
  cover?: string // 相册封面
  cover_preview?: string // 相册封面预览
  background?: string // 相册背景
  background_preview?: string // 相册背景预览
  count?: number // 关联图片数量
  sort?: number // 排序值
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  // tops?: Array<string> // 置顶的元素项
}


/**
 * 插件接口
 */
interface RequestParam {
  file?: File
  filename: string
}
export interface MyPlugin {
  name: string // 名称，对应存储桶的类别
  id?: string // 存储桶id，对应存储桶的id
  version: string // 版本
  doc?: string // 文档地址
  config: Array<{ // 表单定义
    type: string // 字段类型
    label: string // 表单提示文字
    field: string // 生成节点key名称
    default: string // 默认值
    required?: boolean // 是否必填项
    placeholder?: string // 输入框提示文字
    hidden?: boolean // 是否隐藏当前节点
    options?: Array<{ // 下拉框选择项
      label: string
      value: string
    }>
  }>
  uploader: { // 插件上传配置
    axios?: AxiosStatic // 上传
    sparkMd5?: any // 文件md5加密
    md5?: any // md5加密
    hmacsha1?: any // macsha1加密，用于通用的siganature
    crypto?: any
    // 前置操作：获取数据或者数据处理
    beforeEach: (file?: File) => any
    // 返回请求配置
    request: (params: RequestParam) => AxiosRequestConfig
    // 响应格式配置
    response: (res?: AxiosResponse, file?: any) => any
  }
}


/**
 * 聊天时间
 */
export interface ChatData {
  id: number
  time: string // 时间
  text: string // 内容
  reverse: boolean // 是否翻转，询问时为true，回答时为false
  error: boolean // 是否报错
  loading: boolean // 请求中
  role: string // 角色
  clientId?: number // 客户端id，每天生成一个
}