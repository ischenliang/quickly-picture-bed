import { ApiProperty } from "@nestjs/swagger";
import { SettingContact, SettingSystem, SettingWebsite } from "../entities/setting.entity";

export class CreateSettingDto {
  @ApiProperty({
    description: '网站信息',
    example: {
      ico: '',
      desc: '',
      keys: [],
      logo: '',
      name: '',
      title: '',
      author: '',
      domain: '',
      baseUrl: '',
      version: '',
      subtitle: '',
      ico_preview: '',
      logo_preview: '',
      reward_alipay: '',
      reward_weixin: '',
      reward_alipay_preview: '',
      reward_weixin_preview: ''
    }
  })
  website: SettingWebsite

  @ApiProperty({
    description: '联系我们',
    example: {
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

  @ApiProperty({
    description: '系统配置',
    example: {
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
      storage_size: '', // 存储桶最大容量限制
      storage_count: '', // 最多创建存储桶的数量
      copyright_time: '', // 网站运行时间
      copyright_company: '', // 版权归属公司名称
      copyright_miiturl: 'https://beian.miit.gov.cn/', // 备案地址
      copyright_miitbeian: '' // 工信部备案号
    }
  })
  system: SettingSystem

  @ApiProperty({
    description: '更新日志',
    example: ''
  })
  uplog: string

  @ApiProperty({
    description: '',
    example: [
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
