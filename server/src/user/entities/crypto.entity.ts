import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'crypto' })
export class Crypto extends Model<Crypto> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '公钥'
  })
  public_key: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '秘钥'
  })
  private_key: string

  @Column({
    allowNull: false,
    comment: '传输的label'
  })
  label: string

  @Column({
    allowNull: false,
    comment: '加密类型'
  })
  type: string

  @Column({
    allowNull: false,
    comment: '加密长度，通常为1024、2048...'
  })
  bits: string

  @Column({
    allowNull: false,
    comment: '客户端ip，为指定客户端ip生成的密钥对'
  })
  generate_ip: string

  @Column({
    allowNull: false,
    comment: '验证状态',
    defaultValue: false
  })
  is_valid: boolean
}
