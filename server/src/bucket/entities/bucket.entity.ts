import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { UserPlugin } from "src/plugin/entities/user-plugin.entity";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'bucket' })
export class Bucket extends Model<Bucket> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '存储桶名称'
  })
  name: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '存储桶配置'
  })
  config: object

  @Column({
    allowNull: false,
    comment: '排序权重',
    defaultValue: 1
  })
  weight: number

  @Column({
    allowNull: false,
    comment: '是否在上传区域显示',
    defaultValue: true
  })
  visible: boolean

  @ForeignKey(() => User)
  @Column({
    comment: '用户id',
    allowNull: false
  })
  uid: number

  @ForeignKey(() => UserPlugin)
  @Column({
    comment: '用户安装插件id',
    allowNull: false
  })
  user_plugin_id: number

  @BelongsTo(() => User, 'uid')
  user: User

  @BelongsTo(() => UserPlugin, 'user_plugin_id')
  user_plugin: UserPlugin
}
