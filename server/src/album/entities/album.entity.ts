import { Column, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { AlbumTag } from "src/album-tags/entities/album-tag.entity";
import { User } from "src/user/entities/user.entity";

@Table({ tableName: 'album' })
export class Album extends Model<Album> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '相册名称'
  })
  name: string

  @Column({
    allowNull: true,
    comment: '相册描述'
  })
  desc: string

  @Column({
    allowNull: false,
    comment: '访问权限',
    validate: {
      isIn: [
        [0, 1, 2] // 0-私有，1-公开，2-密码访问
      ]
    }
  })
  access_type: number

  @Column({
    allowNull: true,
    comment: '访问密码'
  })
  access_pass: string

  @Column({
    allowNull: true,
    comment: '相册封面'
  })
  cover: string

  @Column({
    allowNull: true,
    comment: '相册背景颜色'
  })
  background: string

  @Column({
    comment: '相册排序，值越大越靠前',
    defaultValue: 1.00,
    allowNull: false
  })
  sort: number

  @Column({
    comment: '相册浏览量',
    defaultValue: 0,
    allowNull: false
  })
  view_num: number

  @ForeignKey(() => User)
  @Column({
    comment: '用户id',
    allowNull: false
  })
  uid: number

  @HasOne(() => AlbumTag)
  tags: AlbumTag[]
  
  // 后续还可以考虑在相册中关联存储桶，这样就可以直接在相册中上传图片
}
