export type Role = {
  id?: string
  name: string
  priority: number
  status: boolean
  remark: string
  ctime?: string
  mtime?: string
}


// 分页器
export interface Page {
  page?: number // 页码
  size?: number // 每页显示数量
}


// 存储桶配置类型
export interface BucketSourceConfig {
  // 配置描述
  label: string
  // 配置最后映射的键名
  value: string
  // 配置类型：可选string、options
  type: string
  // 配置是否必填项
  required?: boolean
  // 配置对应的选择，只有当type为options时才有该属性
  // 对应Dict中的code字段
  listOptions?: string
  // 字典的列表表示
  listOptions_arr?: Array<{
    label: string
    value: any
  }>
  // 用户输入时的说明
  placeholder?: string
  // 默认值
  default?: any
  // 排序值
  sort?: number
  // 用户输入提示说明
  tips?: string
  // 是否隐藏不可见
  hidden?: boolean
  // 是否可用
  disabled?: boolean
}

// 存储桶的存储源：即管理员对存储桶进行配置
export interface BucketSource {
  // 存储源id
  id?: string
  // 存储源名称
  name?: string
  // 存储源类型: 存储源对应的类别,例如：qiniu、oss
  type?: string
  // 存储源状态
  status?: boolean
  // 存储源配置，界面上需要提供可以拖拽调整顺序
  config?: Array<BucketSourceConfig>
  // 存储源配置字符串
  config_str?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 版本号
  version?: string
  // 备注
  remark?: string
}

// 存储桶的存储源：即管理员对存储桶进行配置
export interface BucketSourceHistory {
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
}



// 用户
export interface User {
  // 用户id
  id?: string
  // 手机号
  phone?: string
  // 邮箱
  email?: string
  // 密码
  password?: string
  // 昵称
  nickname?: string
  // 头像
  avatar?: string
  // 角色
  role?: number
  // 职业
  major?: string
  // 性别
  gender?: string
  // 联系地址
  address?: string[]
  // 用户状态
  status?: boolean
  // 个人简介
  desc?: string
  // 创建时间
  createdAt?: string
  // 修改时间
  updatedAt?: string
}


// 字典
export interface Dict {
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
  // 创建时间
  createdAt?: string
  // 修改时间
  updatedAt?: string
}


// 存储桶
export interface Bucket {
  // 存储桶
  id?: string
  // 操作人，用户id
  uid?: string
  // 存储桶类别
  type?: string
  // 存储桶标签：从存储源获取
  tag?: string
  // 存储桶名称
  name?: string
  // 存储桶配置
  config?: string
  // 是否在上传区域显示
  visible?: boolean
  // 存储桶容量占用
  bucket_storage?: number
  // 存储桶数量占用
  bucket_count?: number
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 版本号
  version?: string
  // 最新版本号
  version_last?: string
}


// 图片实体
export interface Image {
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
  // 图片大小
  img_size?: number
  // 存储桶id
  bucket_id?: string
  // 存储桶类型
  bucket_type?: string
  // hash值：用于后续更新时使用
  hash?: string
  // 用户id
  uid?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 是否静态更新
  slient?: boolean
  // 置顶
  top?: boolean
  // 标签
  tags?: string[]
}

// 日志
export interface Log {
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
}


export interface Setting {
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
  }
  // 插件配置
  plugin?: {
    default: string // 插件默认值
  }
  // 更新日志
  uplog?: string // 更新日志url
  // 存储桶后台服务配置
  bucket_service?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}


export interface Habits {
  // 习惯id
  id?: string
  // 用户id
  uid?: string
  // 快捷键
  shortKey?: Array<{
    label: string, // 快捷键描述
    key: string // 快捷键code
    value: string // 快捷键内容：Command + Shift + P
    id: number // 快捷键id
  }>
  // 上传成功提示
  showUpdateTip?: boolean
  // 复制成功提示
  showCopyTip?: boolean
  // 删除成功提示
  showDeleteTip?: boolean
  // 上传后自动复制图片地址类型，支持：url、markdown
  pasteStyle?: string
  // 上传后自动复制图片地址
  autoPaste?: boolean
  // 当前使用图床id
  current?: Bucket
  // 链接格式，默认是 ![]($url)
  // 占位符$url表示图片url位置
  // 占位符$fileName表示文件名
  link_format?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}

// 七牛上传配置
export interface QiniuUploadConfig {
  // 	AccessKey
  accessKey: string
  // SecretKey
  secretKey: string
  // 空间名称
  bucket: string
  // 有效期
  expires?: number
}

// 阿里上传配置
export interface AliUploadConfig {
  // 	accessKeyId
  accessKeyId: string
  // accessKeySecret
  accessKeySecret: string
  // 空间名称
  bucket: string
  // 路径
  path?: string
  // 区域
  area?: string
  // 文件名称
  filename?: string
}

// 腾讯上传配置
export interface TencentUploadConfig {
  // 版本
  version?: string
  // 	secretId
  secretId: string
  // secretKey
  secretKey: string
  // appId
  appId: string
  // 空间名称
  bucket: string
  // 区域
  area?: string
  // 路径
  path?: string
  // 文件名称
  filename?: string
}

// 腾讯上传配置
export interface UpyunUploadConfig {
  // 	操作者
  operator: string
  // 密码
  password: string
  // 空间名称
  bucket: string
  // 加速域名
  domain?: string
  // 路径
  path?: string
  // 后缀
  suffix?: string
  // 文件名称
  filename?: string
  // 文件md5
  md5?: string
}


// 七牛云文件管理
export interface QiniuFileManager extends QiniuUploadConfig {
  // 文件路径
  fileName: string
}


/**
 * 图形验证码
 */
export interface VerifyCode {
  id?: string // 验证码id
  last_id?: string // 上一次生成的验证码id
  code?: string // 验证码内容
  anser?: string // 验证码结果
  expire_at?: string // 有效期至
  createdAt?: string // 创建时间
}


/**
 * 图形验证码
 */
export interface SmsCode {
  id?: string // 验证码id
  account?: string // 账号，邮箱或者手机号
  type?: string // 类型，phone或者email
  code?: string // 验证码结果
  expire_at?: string // 有效期至
}

/**
 * 相册
 */
export interface Album {
  id?: string // 验证码id
  uid?: string // 相册拥有者
  name?: string // 相册名称
  desc?: string // 相册描述
  cover?: string // 相册封面
  background?: string // 相册背景
  sort?: number // 排序值
  // tops?: string[] // 置顶项列表
}