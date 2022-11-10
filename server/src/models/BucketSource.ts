import { DataTypes } from 'sequelize'
import seq from '../utils/seq'
/**
 * id: 存储源id UUID
 * name：存储源名称
 * type：存储源类型: 存储源对应的类别,例如：qiniu、oss
 * config：存储源配置
 * createdAt：创建时间
 * updatedAt：更新时间
 */
const BucketSourceModel = seq.define('bucketSource', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储源名称'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储源类型'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '存储源状态',
    defaultValue: true
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '存储源配置'
  }
}, {
  freezeTableName: true
})

export default BucketSourceModel