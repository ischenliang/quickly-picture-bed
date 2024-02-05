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
const BucketSourceHistoryModel = seq.define('bucketsourcehistory', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid:历史记录id'
  },
  bs_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '存储源id'
  },
  config: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '当前最新存储源配置'
  },
  config_old: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '旧版本存储源配置'
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '最新版本号',
    defaultValue: '1.0.0'
  },
  version_old: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '旧版本号',
    defaultValue: '1.0.0'
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '备注',
    defaultValue: ''
  }
}, {
  freezeTableName: true
})

export default BucketSourceHistoryModel