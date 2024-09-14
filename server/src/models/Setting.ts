import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const SettingModel = seq.define('setting', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  website: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '网站信息'
  },
  contact: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '联系我们'
  },
  system: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '系统配置'
  },
  plugin: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '插件配置',
    defaultValue: {
      default: ''
    }
  },
  uplog: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '更新日志url'
  },
  bucket_service: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '存储桶后台服务配置'
  }
}, {
  freezeTableName: true
})

export default SettingModel