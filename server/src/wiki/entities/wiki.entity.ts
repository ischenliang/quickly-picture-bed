import { BelongsTo, Column, ForeignKey, Table, Model, HasMany, DataType } from "sequelize-typescript";
import { Article } from "src/article/entities/article.entity";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'wiki' })
export class Wiki extends Model<Wiki> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '知识库名称'
  })
  title: string

  @Column({
    allowNull: true,
    comment: '知识库描述'
  })
  description: string

  @Column({
    allowNull: false,
    comment: '文档状态，私有还是公开'
  })
  status: boolean

  @Column({
    allowNull: false,
    comment: '文档权重，值越大越靠前',
    defaultValue: 1
  })
  weight: number

  @Column({
    allowNull: false,
    comment: '空间配置',
    defaultValue: {
      type: 'gitee',
      owner: '',
      repo: '',
      branch: 'master',
      access_token: '',
      baseurl: '/'
    },
    type: DataType.JSON
  })
  config: object

  @ForeignKey(() => User)
  @Column({
    comment: '文档拥有者'
  })
  uid: number

  @BelongsTo(() => User, 'uid')
  user: User
  
  @HasMany(() => Article)
  articles: Article[]
}
