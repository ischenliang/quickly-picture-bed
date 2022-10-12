import { BucketSourceEnum } from "./enum"

export interface TableColumnConfig {
  align: string // 对齐方式：center、left、right
  label: string // 列的标题
  width: string // 列的宽度
  prop: string // 列的字段名
  slot?: string // 是否开启插槽
}

// 通用表格列表list数据
export interface ListInter<T> {
  page?: number // 页码
  size?: number // 每页显示数量
  total?: number // 总计条数
  filters?: { // 筛选条件
    [prop: string]: any
  }
  data: Array<T>
  config?: Array<TableColumnConfig>
}



/**
 * 存储源实体
 */
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
  config?: Array<BucketSourceConfig>
  // 存储源配置字符串
  config_str?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
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
  // 图片大小
  img_size?: number
  // 存储桶id
  bucket_id?: string
  // 存储桶类型
  bucket_type?: string
  // 用户id
  uid?: string
  // 排序值
  sort?: number
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
  mobilePhoneNumber?: string
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
  address?: string
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
    title?: string // 标题
    subtitle?: string // 副标题
    domain?: string // 域名
    desc?: string // 描述
    keys?: Array<string> // 关键词
    author?: string // 作者
    // 版权归属公司名称
    copyright_company?: string
    // 网站运行时间
    copyright_time?: string
    // 工信部备案号
    copyright_miitbeian?: string
    // 工信部备案地址(即工信部官网地址https://beian.miit.gov.cn/)
    copyright_miiturl?: string
    // 打赏
    // 支付宝打赏二维码
    reward_alipay?: string
    // 微信打赏二维码
    reward_weixin?: string
  }
  // 上传配置
  upload?: {
    // 所有资源文件的前缀，主要是用于本地存储桶的前缀
    baseurl?: string
    // 可以上传的文件类型，例如['png', 'jpeg', 'mp4', 'flv', 'webp']
    accept?: Array<string>
    // 单个文件最大容量
    maxsize?: number
    // 单次最多勾选多少文件
    maxcount?: number
  }
  // 联系我们
  contact?: {
    // 微信
    weixin?: string
    qq?: string
    github?: string
    gitee?: string
    email?: string
    qq_group?: string
  }
  // 默认密码
  default_pwd?: string
  // 默认头像
  default_avatar?: string
  // 存储桶最大容量限制
  storage_size?: number
  // 最多能创建多少个存储桶
  bucket_size?: number
  // 关于我们内容, markdown内容
  about?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}


/**
 * 使用习惯管理
 */
export interface Habits {
  // 习惯id
  id?: string
  // 习惯用户id
  uid?: string
  // 快捷键配置: 类似于vscode
  shortKey?: Array<{
    label: string, // 快捷键描述
    key: string // 快捷键code
    value: string // 快捷键内容：Command + Shift + P 
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
  autoPaste?: true
  // 当前使用图床id
  current?: string
  // 链接格式，默认是 ![]($url)
  // 占位符$url表示图片url位置
  // 占位符$fileName表示文件名
  link_format?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
}