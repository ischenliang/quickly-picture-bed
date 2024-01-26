import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";
import { Wiki } from "src/wiki/entities/wiki.entity";

@Table({ tableName: 'article' })
export class Article extends Model<Article> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '文章标题'
  })
  title: string

  @Column({
    allowNull: false,
    comment: '文章类型，可选file|folder|mind'
  })
  type: string

  @Column({
    allowNull: false,
    comment: '文章存储位置'
  })
  url: string
  
  @Column({
    allowNull: false,
    comment: '文章状态，true-发布，false-草稿',
    defaultValue: false
  })
  public: boolean
  
  @Column({
    allowNull: false,
    comment: '文章权重，值越大越靠前',
    defaultValue: 1
  })
  weight: number

  @Column({
    allowNull: false,
    comment: '文章sha，存储git的sha值'
  })
  sha: string
  
  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '文章所使用主题，由系统内置几套主题选择',
    defaultValue: {
      code: 'github',
      markdown: 'github'
    }
  })
  theme: {
    code: string // 代码主题
    markdown: string // 文章主题
  }
  
  @Column({
    allowNull: true,
    comment: '文章发布时间'
  })
  publishedAt: string

  @ForeignKey(() => Article)
  @Column({
    allowNull: true,
    comment: '上级id',
    defaultValue: null
  })
  pid: number

  @ForeignKey(() => Wiki)
  @Column({
    allowNull: false,
    comment: '关联知识库id'
  })
  wid: number

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    comment: '用户id'
  })
  uid: number

  @BelongsTo(() => Wiki)
  wiki: Wiki

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Article, 'pid')
  parent: Article

  @HasMany(() => Article, 'pid')
  children: Article[]
}
