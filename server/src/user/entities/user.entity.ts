import { Column, Model, Table, DataType, HasOne, HasMany } from "sequelize-typescript";
import { Habits } from "./habits.entity";
import { Wiki } from "src/wiki/entities/wiki.entity";

@Table({ tableName: 'user' })
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    unique: true,
    allowNull: false,
    comment: '用户邮箱'
  })
  email: string

  @Column({
    defaultValue: '默认名称',
    comment: '用户昵称'
  })
  username: string

  @Column({
    comment: '手机号',
    unique: true
  })
  phone: string 

  @Column({
    allowNull: false,
    comment: '密码'
  })
  password: string

  @Column({
    comment: '角色',
    defaultValue: 1
  })
  role: number

  @Column({
    comment: '头像',
    defaultValue: '星座_白羊座'
  })
  avatar: string

  @Column({
    comment: '自我描述'
  })
  desc: string

  @Column({
    comment: '职业'
  })
  major: string

  @Column({
    comment: '性别'
  })
  gender: string

  @Column({
    type: DataType.JSON,
    defaultValue: ['', '', ''],
    comment: '地址'
  })
  address: string[]

  @Column({
    defaultValue: true,
    comment: '用户状态'
  })
  status: boolean

  @Column({
    type: DataType.JSON,
    comment: '用户配置',
    defaultValue: {
      "chatgpt": false
    }
  })
  config: object

  @HasOne(() => Habits)
  habits: Habits

  // 解决报错: 不能将类型“typeof Wiki”分配给类型“ModelType<Optional<Wiki, NullishPropertiesOf>, {}>"。这个错
  @HasMany(() => Wiki, 'uid')
  wikis: Wiki[]
}