import { BelongsTo, Column, ForeignKey, Table, Model, HasMany, DataType } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";
import { DataTypes } from "sequelize";

@Table({ tableName: 'notify_history' })
export class NotifyHistory extends Model<NotifyHistory> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '问题id'
  })
  question_id: number

  @Column({
    allowNull: false,
    comment: '对象id(问题-问题id 答主-用户id 题主-用户id)'
  })
  obj_id: string

  @Column({
    allowNull: false,
    comment: '通知类型(question-问题 publisher-题主 answer-答主)'
  })
  notify_type: string

  @Column({
    allowNull: false,
    comment: '通知来源(platform-平台收录 follow-关注 answer-回答 publish-发布)'
  })
  notify_origin: string
  
  @Column({
    allowNull: false,
    comment: '通知内容',
    type: DataTypes.TEXT
  })
  notify_content: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '通知邮箱'
  })
  notify_emails: string[]

  @ForeignKey(() => User)
  @Column({
    comment: '创建人'
  })
  uid: number

  @BelongsTo(() => User, 'uid')
  user: User
}
