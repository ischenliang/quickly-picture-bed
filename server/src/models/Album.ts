import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

// 相册
const AlbumModel = seq.define('album', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '相册名称'
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '相册描述'
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '相册封面'
  },
  background: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '相册背景'
  },
  sort: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '排序值',
    defaultValue: 1.00
  },
  tops: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '置顶项列表',
    defaultValue: []
  },
}, {
  freezeTableName: true
})

export default AlbumModel