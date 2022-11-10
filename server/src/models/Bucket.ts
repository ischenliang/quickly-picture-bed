import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const BucketModel = seq.define('bucket', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储桶类别'
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储桶标签'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储桶名称'
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '存储桶配置'
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '是否在上传区域显示',
    defaultValue: true
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '操作人，用户id'
  }
}, {
  freezeTableName: true
})

export default BucketModel