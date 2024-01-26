// 相册标签库：便于用户可以直接从标签库选择标签

import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Album } from "src/album/entities/album.entity";

@Table({ tableName: 'album_tag' })
export class AlbumTag extends Model<AlbumTag> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @ForeignKey(() => Album)
  @Column({
    allowNull: false,
    comment: '相册id'
  })
  album_id: number
  
  @Column({
    type: DataType.JSON,
    allowNull: false,
    comment: '相册标签tags',
    defaultValue: [
      { type: 'primary', value: '默认标签1' },
      { type: 'success', value: '默认标签2' },
      { type: 'danger', value: '默认标签3' }
    ]
  })
  tags: Array<{
    type: string
    value: string
  }>
}
