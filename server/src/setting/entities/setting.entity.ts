import { Column, DataType, Model, Table } from "sequelize-typescript";

export class SettingWebsite {
  ico: string
  desc: string
  keys: string[]
  logo: string
  name: string
  author: string
  version: string
  reward_alipay: string
  reward_weixin: string
}

export class SettingContact {
  about: string
  qq: string
  email: string
  gitee: string
  github: string
  weixin: string
  qq_group: string
}

export class SettingSystem {
  accept: string[]
  maxsize: number
  icon_url: string
  icon_font: string
  icon_prefix: string
  map_type: string
  map_key: string
  maxcount: number
  mail_pass: string
  mail_user: string
  storage_size: number
  storage_count: number
  copyright_time: string
  copyright_company: string
  copyright_miiturl: string
  copyright_miitbeian: string
  enable_register: boolean // 是否启用注册功能
  enable_chatgpt: boolean // 是否启用chatgpt功能
} 

@Table({ tableName: 'setting' })
export class Setting extends Model<Setting> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '网站信息',
    defaultValue: {
      ico: '',
      desc: '',
      keys: [],
      logo: '',
      name: '',
      author: '',
      version: '',
      reward_alipay: '',
      reward_weixin: ''
    }
  })
  website: SettingWebsite

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '联系我们',
    defaultValue: {
      about: '',
      qq: '',
      email: '',
      gitee: '',
      github: '',
      weixin: '',
      qq_group: ''
    }
  })
  contact: SettingContact

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '系统配置',
    defaultValue: {
      accept: ["jpeg", "jpg", "webp", "ico", "gif", "png", "svg"],
      maxsize: 10, // 单次最多勾选多少文件
      icon_url: '', // 图标网址
      icon_font: '', // 图标字体
      icon_prefix: '', // 图标前缀
      map_type: '', // 地图类型：baidu和gaode
      map_key: '', // 对应的秘钥
      maxcount: 30, // 单个文件最大容量，单位M
      mail_pass: '', // 发件人
      mail_user: '', // 授权码
      storage_size: 0, // 存储桶最大容量限制
      storage_count: 0, // 最多创建存储桶的数量
      copyright_time: '', // 网站运行时间
      copyright_company: '', // 版权归属公司名称
      copyright_miiturl: 'https://beian.miit.gov.cn/', // 备案地址
      copyright_miitbeian: '', // 工信部备案号
      enable_register: true, // 启用注册功能
      enable_chatgpt: true, // 启用chatgpt功能
    }
  })
  system: SettingSystem

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '更新日志',
    defaultValue: '# 更新日志'
  })
  uplog: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '右上角菜单配置',
    defaultValue: [
      { "label": "文档中心", "link": "", "target": "_blank" },
      { "label": "Github", "link": "", "target": "_blank" },
      { "label": "Gitee", "link": "", "target": "_blank" }
    ]
  })
  bucket_service: Array<{
    label: string
    link: string
    target: string
  }>
}
