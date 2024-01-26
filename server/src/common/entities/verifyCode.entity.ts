import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'verifycode' })
export class VerifyCode extends Model<VerifyCode> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    type: DataType.BLOB,
    allowNull: false,
    comment: '验证码内容'
  })
  code: string

  @Column({
    allowNull: false,
    comment: '验证码答案'
  })
  anser: string

  @Column({
    allowNull: false,
    comment: '验证码有效期'
  })
  expire_at: string
}