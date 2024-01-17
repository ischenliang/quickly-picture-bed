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

/**
 * 图片实体
 */
export interface ImageInter {
  // 图片id
  id?: number
  // 图片名称
  name?: string
  img_name?: string
  // 原始名称
  origin_name?: string
  // 图片宽度
  width?: number
  // 图片高度
  height?: number
  // 文件类型
  mime_type?: string
  // 图片url
  url?: string
  // 图片基地址
  baseurl?: string
  // 图片预览地址
  preview_url?: string
  img_preview_url?: string
  // 图片大小
  size?: number
  // 存储桶id
  bucket_id?: string
  // 相册id
  album_id?: number | string
  // hash值：用于后续更新时使用
  hash?: string
  // 用户id
  uid?: string
  // 是否选中
  checked?: boolean
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 排序值
  sort?: number
  // 标签
  tags?: TagInter[]
  // 权重
  weight?: number
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
  email?: string
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
  id?: number
  // 存储桶名称
  name?: string
  // 存储桶配置
  config?: object
  // 存储桶权重
  weight?: number
  // 是否在上传区域显示
  visible?: boolean
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 操作人，用户id
  uid?: number
  // 用户安装插件id
  user_plugin_id?: number | string
  // 用户安装插件
  user_plugin?: UserPluginInter
}

export interface PluginInter {
  id?: number
  // 插件名称
  name?: string
  // 插件别名
  title?: string
  // 插件描述
  description?: string
  // 插件版本
  version?: string
  // 插件logo
  logo?: string
  // 插件作者
  author?: string
  // 插件类别
  category?: string
  // 插件运行平台
  platform?: string
  // 插件安装次数
  downloadCounts?: number
  // 插件状态
  status?: boolean
  // 插件权重
  weight?: number
  // 插件是否付费
  payment?: boolean
  // 插件付费版本
  payment_type?: string
  // 插件付费价格
  price?: number
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 标签列表
  tags?: string[]
  user_plugin?: {
    id: number
    version: string
    status: boolean
    createdAt: string
  }
}

export interface UserPluginInter {
  id?: number
  // 插件id
  pid?: number
  // 用户id
  uid?: number
  // 状态
  status?: boolean
  // 安装版本号
  version?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 插件
  plugin?: PluginInter
}

export interface WikiInter {
  id?: number
  title?: string
  description?: string
  status?: boolean
  config?: {
    type: 'gitee' | 'github'
    owner: string
    repo: string
    branch: string
    access_token: string
    baseurl: string
  }
  uid?: number
  weight?: number
  updatedAt?: string
  createdAt?: string
}

export interface ArticleInter {
  id?: number
  title?: string
  markdown?: string
  type?: string
  url?: string
  weight?: number
  wid?: number
  uid?: number
  theme?: {
    code?: string
    markdown?: string
  }
  sha?: string
  publishedAt?: string
  public?: number
  pid?: number
  createdAt?: string
  updatedAt?: string
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
    ico?: string // ico
    name?: string // 名称
    desc?: string // 描述
    keys?: Array<string> // 关键词
    author?: string // 作者
    version?: string // 版本号
    // 打赏
    // 支付宝打赏二维码
    reward_alipay?: string
    // 微信打赏二维码
    reward_weixin?: string
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

    // 其他配置
    enable_register?: boolean // 是否启用注册功能
    enable_chatgpt?: boolean // 是否启用chatgpt功能
  }
  // 更新日志
  uplog?: string // 更新日志url
  // 存储桶后台服务配置
  bucket_service?: Array<{
    label: string
    link: string
    target: string
  }>
  bucket_service_str?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}


/**
 * 偏好设置管理
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
  showTip?: {
    copy: boolean // 复制提示
    delete: boolean // 删除提示
    update: boolean
    upload: boolean // 上传提示
  }
  // 上传前重命名
  rename?: boolean
  // 时间戳重命名
  autoRename?: boolean
  // 上传后自动复制图片地址类型，支持：url、markdown
  pasteStyle?: string
  // 上传后自动复制图片地址
  autoPaste?: boolean
  // 当前使用图床id
  current_bucket?: number
  // 当前使用相册id
  current_album?: number
  // 当前使用主题
  current_theme?: {
    id: number
    plugin_id: number
  }
  // 链接格式，默认是 ![]($url)
  // 占位符$url表示图片url位置
  // 占位符$fileName表示文件名
  link_format?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 图片层现方式
  gallery_img_fit?:  "fill" | "contain" | "cover" | "none" | "scale-down"
  // 图片显示名称
  gallery_img_name?: string
  // 相册封面层现方式
  album_cover_fit?: string
}


/**
 * 图形验证码
 */
export interface VerifyCodeInter {
  id?: string
  data?: string
  last_id?: string
}


/**
 * 相册
 */
export interface AlbumInter {
  id?: number // 验证码id
  uid?: number // 相册拥有者
  name?: string // 相册名称
  desc?: string // 相册描述
  cover?: string // 相册封面
  background?: string // 相册背景
  count?: number // 关联图片数量
  sort?: number // 排序值
  view_num?: number // 浏览量
  access_type?: 1 | 2 | 0 // 访问权限,1 - 公开，2 - 密码访问，0 - 私有
  access_pass?: string // 访问密码，只有当access_type为2时有
  sortby?: string // 排序字段
  sortorder?: string // 排序顺序
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}
// 相册标签
export interface AlbumTag {
  id: number
  album_id: number
  tags: Array<TagInter>
}
export interface TagInter {
  type: '' | 'primary' | 'success' | 'danger' | 'info' | 'warning'
  value: string
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

/**
 * 知识库
 */
export interface WikiInter {
  id?: number // id
  title?: string // 名称
  description?: string // 描述
  weight?: number // 权重
  status?: boolean // 状态
  uid?: number // 用户id
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  config?: {
    type: 'gitee' | 'github' // git类型
    owner: string // git用户
    repo: string // git仓库
    branch: string // git分支
    baseurl: string // git基地址
    access_token: string // git访问token
  }
}

export interface ActionItemInter {
  icon: string
  size: string | number
  color?: any
  text: string
}

export interface RewardInter {
  cover: string
  label: string
}

export interface BucketStatsInter {
  id: number
  bucket_storage: string | number
  bucket_count: number
}