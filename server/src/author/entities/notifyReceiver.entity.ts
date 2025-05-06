import { BelongsTo, Column, ForeignKey, Table, Model, HasMany, DataType } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'notify_receiver' })
export class NotifyReceiver extends Model<NotifyReceiver> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '邮箱地址'
  })
  email: string

  @Column({
    allowNull: false,
    comment: '备注'
  })
  remark: string

  @Column({
    allowNull: false,
    comment: '账号状态',
    defaultValue: true
  })
  status: number

  @ForeignKey(() => User)
  @Column({
    comment: '创建人'
  })
  uid: number

  @BelongsTo(() => User, 'uid')
  user: User
}
