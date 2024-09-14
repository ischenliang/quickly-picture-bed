import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const HabitsModel = seq.define('habits', {
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
  shortKey: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '快捷键'
  },
  showUpdateTip: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '上传成功提示',
    defaultValue: true
  },
  showCopyTip: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '复制成功提示',
    defaultValue: true
  },
  showDeleteTip: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '删除成功提示',
    defaultValue: true
  },
  pasteStyle: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '上传后自动复制图片地址类型，支持：url、markdown',
    defaultValue: 'url'
  },
  autoPaste: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '上传后自动复制图片地址',
    defaultValue: false
  },
  current: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '当前使用图床',
    defaultValue: '{}'
  },
  current_album: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '当前使用相册',
    defaultValue: ''
  },
  link_format: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '链接格式，默认是 ![]($url)',
    defaultValue: '![]($url)'
  }
}, {
  freezeTableName: true
})

export default HabitsModel