import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const ImageModel = seq.define('image', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  bucket_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储桶id'
  },
  album_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '相册id'
  },
  bucket_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储桶类型'
  },
  img_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '图片名称'
  },
  img_width: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '图片宽度',
    defaultValue: 0
  },
  img_height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '图片高度',
    defaultValue: 0
  },
  mine_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文件类型'
  },
  img_url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '图片url'
  },
  img_size: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '图片大小'
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'hash值：用于后续更新时使用'
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户id'
  },
  add_time: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '添加进相册时间'
  }
}, {
  freezeTableName: true
})

export default ImageModel