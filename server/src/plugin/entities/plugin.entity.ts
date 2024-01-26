import { Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { UserPlugin } from "./user-plugin.entity";


@Table({ tableName: 'plugin' })
export class Plugin extends Model<Plugin> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    comment: '插件id'
  })
  id: number

  @Column({
    comment: '插件名称，对应npm包名称',
    allowNull: false,
  })
  name: string

  @Column({
    comment: '插件描述，自动从npm包package.json中获取',
    allowNull: false
  })
  description: string

  @Column({
    comment: '插件版本号，从所有版本中选择，默认取最新版本',
    allowNull: false
  })
  version: string

  @Column({
    comment: '插件logo，自动从npm包package.json中获取',
    allowNull: false
  })
  logo: string

  @Column({
    comment: '插件别名，页面上所显示的插件名称',
    allowNull: false
  })
  title: string

  @Column({
    comment: '插件作者，自动从npm包package.json中获取',
    allowNull: false
  })
  author: string

  @Column({
    comment: '插件类别，目前支持themer|uploader|transformer|handler|commander',
    allowNull: false,
    validate: {
      isIn: [['themer', 'uploader', 'transformer', 'handler', 'commander', 'tooler']] // 检查值是其中之一
    }
  })
  category: string

  @Column({
    comment: '插件运行环境，Node|Browser',
    allowNull: false,
    validate: {
      isIn: [['Node', 'Browser']] // 检查值是其中之一
    }
  })
  platform: string

  @Column({
    comment: '插件安装次数，安装一次累加一次',
    allowNull: false,
    defaultValue: 0
  })
  downloadCounts: number

  @Column({
    comment: '插件状态，是否用户可见',
    allowNull: false,
    defaultValue: false
  })
  status: boolean

  @Column({
    comment: '插件权重，权重越大越靠前',
    allowNull: false,
    defaultValue: 1
  })
  weight: number

  @Column({
    comment: '插件是否需要付费',
    allowNull: false,
    defaultValue: false
  })
  payment: boolean

  @Column({
    comment: '插件付费版本',
    allowNull: false,
    validate: {
      isIn: [['paid', 'limited_free', 'free']] // paid-付费 limited_free-限时免费 free-免费
    },
    defaultValue: 'free'
  })
  payment_type: string

  @Column({
    type: DataType.FLOAT,
    comment: '插件付费需设置价格',
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      isFloat: true // 是否为浮点数
    }
  })
  price: number

  @Column({
    type: DataType.JSON,
    comment: '插件标签',
    allowNull: false,
    defaultValue: []
  })
  tags: Array<string>
  
  @HasOne(() => UserPlugin)
  user_plugin: UserPlugin
}
