import { BucketSourceEnum } from "./enum"

export interface TableColumnConfig {
  align: string // 对齐方式：center、left、right
  label: string // 列的标题
  width: string // 列的宽度
  prop: string // 列的字段名
  slot?: boolean // 是否开启插槽
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
}
// 存储桶的存储源：即管理员对存储桶进行配置
export interface BucketSourceInter {
  // 存储源id
  id?: string
  // 存储源名称
  name?: string
  // 存储源类型: 存储源对应的类别,例如：qiniu、oss
  type?: BucketSourceEnum
  // 存储源配置，界面上需要提供可以拖拽调整顺序
  config?: Array<BucketSourceConfig>
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
  bucket_id?: any
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
  role?: number
  // 加入方式
  join_type?: number
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
  // 操作id，系统操作：“四川省成都市”(ip定位)，图片操作：“ID:2366”(文件id)
  operate_cont?: string
  // 操作记录，系统操作：“218.88.53.138”(ip)，图片操作：“ab346d65ff689e44.jpg”(文件名称)
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
  // 是否在上传区域显示
  visible?: boolean
  // 创建时间
  createdAt?: string
  // 更新时间
  updatedAt?: string
  // 操作人，用户id
  uid?: string
}