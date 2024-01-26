import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'habits' })
export class Habits extends Model<Habits> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    comment: '用户id'
  })
  uid: number

  @Column({
    type: DataType.JSON,
    defaultValue: [
      {"id": 1, "key": "快捷上传", "label": "点击快捷键自动上传粘贴板中的图片", "value": "Command + K"},
      {"id": 2, "key": "帮助中心", "label": "点击快捷键自动打开帮助中心窗口", "value": "Command + H"},
      {"id": 3, "key": "个人中心", "label": "点击快捷键自动进入个人中心", "value": "Command + P + C"},
      {"id": 4, "key": "上传网络图片", "label": "点击快捷键自动上传粘贴板中的网络图片", "value": "Command + P + C"},
      {"id": 5, "key": "快捷退出", "label": "点击快捷键自动退出登录", "value": "Command + P + C"}
    ],
    allowNull: false,
    comment: '快捷键设置'
  })
  shortKey: Array<{
    id: number
    key: string
    label: string
    value: string
  }>

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '提示功能',
    defaultValue: {
      upload: false, // 上传成功提示
      copy: false, // 复制成功提示
      delete: false, // 删除成功提示
      update: false, // 更新成功提示
    }
  })
  showTip: object

  @Column({
    defaultValue: 'url',
    allowNull: false,
    comment: '上传后自动复制图片地址类型，支持：url、markdown'
  })
  pasteStyle: string

  @Column({
    defaultValue: false,
    allowNull: false,
    comment: '上传后自动复制图片地址'
  })
  autoPaste: boolean

  @Column({
    allowNull: true,
    comment: '当前使用存储桶'
  })
  current_bucket: number

  @Column({
    allowNull: true,
    comment: '当前使用相册'
  })
  current_album: number

  @Column({
    allowNull: false,
    type: DataType.JSON,
    comment: '当前使用主题',
    defaultValue: {
      id: 0,
      plugin_id: 0
    }
  })
  current_theme: {
    id: number
    plugin_id: number
  }

  @Column({
    allowNull: false,
    comment: '链接格式，默认是 ![]($url)',
    defaultValue: '![]($url)'
  })
  link_format: string

  @Column({
    allowNull: false,
    comment: '图片层现方式',
    defaultValue: 'none'
  })
  gallery_img_fit: string

  @Column({
    allowNull: false,
    comment: '图片显示名称',
    defaultValue: 'origin_name'
  })
  gallery_img_name: string

  @Column({
    allowNull: false,
    comment: '相册封面层现方式',
    defaultValue: 'none'
  })
  album_cover_fit: string
}
