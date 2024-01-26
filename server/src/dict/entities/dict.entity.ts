import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'dict' })
export class Dict extends Model<Dict> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '字典名称'
  })
  name: string

  @Column({
    unique: true,
    allowNull: false,
    comment: '字典编码-唯一'
  })
  code: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '字典名称',
    defaultValue: []
  })
  values: {
    label: string
    value: any
  }[]
}