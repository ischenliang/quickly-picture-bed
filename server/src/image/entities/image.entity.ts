import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'image' })
export class Image extends Model<Image> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    comment: '图片id'
  })
  id: number

  @Column({
    allowNull: false,
    comment: '存储桶id'
  })
  bucket_id: number

  @Column({
    allowNull: false,
    comment: '图片名称，自动生成的名称(可修改)'
  })
  name: string

  @Column({
    allowNull: false,
    comment: '图片原名称'
  })
  origin_name: string

  @Column({
    comment: '图片宽度',
    allowNull: false
  })
  width: number

  @Column({
    comment: '图片高度',
    allowNull: false
  })
  height: number

  @Column({
    comment: '图片媒体类型，如: image/png',
    allowNull: false
  })
  mime_type: string

  @Column({
    type: DataType.TEXT,
    comment: '图片存储相对路径，如: img/202304071707109.png',
    allowNull: false
  })
  url: string

  @Column({
    comment: '图片大小，单位byte',
    allowNull: false
  })
  size: number

  @Column({
    comment: '图片sha',
    allowNull: false
  })
  hash: string

  @Column({
    comment: '图片权重，排序值',
    allowNull: false,
    defaultValue: 1
  })
  weight: number

  @Column({
    comment: '图片基地址，存储存储桶的访问前缀',
    allowNull: false
  })
  baseurl: string

  @Column({
    comment: '图片配置',
    allowNull: false,
    type: DataType.JSON,
    defaultValue: {}
  })
  config: object

  @Column({
    comment: '图片标签',
    allowNull: false,
    type: DataType.JSON,
    defaultValue: []
  })
  tags: {
    type: string
    value: string
  }[]

  @ForeignKey(() => User)
  @Column({
    comment: '用户id',
    allowNull: false,
  })
  uid: number

  @Column({
    comment: '相册id',
    allowNull: true
  })
  album_id: number

  @Column({
    comment: '添加相册时间',
    allowNull: true
  })
  add_time: string
}
