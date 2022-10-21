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
  // 存储源配置，界面上需要提供可以拖拽调整顺序
  config?: Array<BucketSourceConfig>
  // 存储源配置字符串
  config_str?: string
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
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
  address?: string
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
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
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