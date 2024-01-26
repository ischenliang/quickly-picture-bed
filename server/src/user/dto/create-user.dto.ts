import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";


export class UserConfig {
  @ApiProperty({ description: 'chatgpt功能', example: true, default: false })
  chatgpt: boolean
}

export class CreateUserDto {
  @ApiProperty({ description: '邮箱', example: 'xxx@163.com' })
  email: string // 邮箱

  @ApiProperty({ description: '角色，1-普通用户，10-管理员', example: 1, enum: [1, 10] })
  role: number

  @ApiProperty({ description: '用户昵称', example: '默认名称', default: '默认名称' })
  username: string

  @ApiProperty({ description: '用户头像', example: '星座_白羊座', default: '星座_白羊座' })
  avatar: string

  @ApiProperty({ description: '手机号', example: '132xxxx9371' })
  phone?: string

  @ApiProperty({
    description: '用户配置',
    example: { chatgpt: true },
    oneOf: [
      { $ref: getSchemaPath(UserConfig) }
    ]
  })
  config?: UserConfig

  @ApiProperty({ description: '默认密码，服务端进行md5加密', example: '000000', default: '000000' })
  password: string

  @ApiProperty({ description: '用户状态, true-启用, false-禁用' })
  status?: boolean
}

export class CreateHabitDto {
  @ApiProperty({
    description: '快捷键设置',
    example: [
      {"id": 1, "key": "快捷上传", "label": "点击快捷键自动上传粘贴板中的图片", "value": "Command + K"},
      {"id": 2, "key": "帮助中心", "label": "点击快捷键自动打开帮助中心窗口", "value": "Command + H"},
      {"id": 3, "key": "个人中心", "label": "点击快捷键自动进入个人中心", "value": "Command + P + C"},
      {"id": 4, "key": "上传网络图片", "label": "点击快捷键自动上传粘贴板中的网络图片", "value": "Command + P + C"},
      {"id": 5, "key": "快捷退出", "label": "点击快捷键自动退出登录", "value": "Command + P + C"}
    ]
  })
  shortKey: Array<{
    id: number
    key: string
    label: string
    value: string
  }>

  @ApiProperty({
    description: '快捷键设置',
    example: {
      upload: false,
      copy: false,
      delete: false,
      update: false
    }
  })
  showTip: {
    upload: boolean
    copy: boolean
    delete: boolean
    update: boolean
  }

  @ApiProperty({ description: '上传后自动复制图片地址类型，支持：url、markdown', example: 'url' })
  pasteStyle: string

  @ApiProperty({ description: '上传后自动复制图片地址', example: false })
  autoPaste: boolean

  @ApiProperty({ description: '当前使用存储桶' })
  current_bucket: number

  @ApiProperty({ description: '当前使用相册' })
  current_album: number

  @ApiProperty({ description: '链接格式，默认是 ![]($url)', example: '![]($url)' })
  link_format: string
}


export class UserFilter extends PageSearch {
  @ApiProperty({ description: '用户角色' })
  role: number
}