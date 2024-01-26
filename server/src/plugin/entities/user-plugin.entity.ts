import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Plugin } from "./plugin.entity";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'user_plugin' })
export class UserPlugin extends Model<UserPlugin> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @ForeignKey(() => Plugin)
  @Column({
    comment: '插件id，关联插件表',
    allowNull: false
  })
  pid: number

  @ForeignKey(() => User)
  @Column({
    comment: '用户id，关联用户表',
    allowNull: false
  })
  uid: number

  @Column({
    comment: '插件状态，停用还是启用',
    allowNull: false,
    defaultValue: true
  })
  status: boolean

  @Column({
    comment: '当前安装的插件版本号',
    allowNull: false
  })
  version: string

  @BelongsTo(() => Plugin)
  plugin: Plugin

  @BelongsTo(() => User)
  user: User
}