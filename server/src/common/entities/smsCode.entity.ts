import { Column, Table, Model } from "sequelize-typescript";

@Table({ tableName: 'smscode' })
export class SmsCode extends Model<SmsCode> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '账号，邮箱或者手机号'
  })
  account: string

  @Column({
    allowNull: false,
    comment: '类别，可选email|phone'
  })
  type: 'email' | 'phone'

  @Column({
    allowNull: false,
    comment: '验证码内容'
  })
  code: string

  @Column({
    allowNull: false,
    comment: '验证码有效期'
  })
  expire_at: string
}