import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const LogModel = seq.define('log', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  type: {
    // 1: 登录系统 2：上传图片 3：删除图片 4：更新图片 5：使用chatgpt
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '操作类别'
  },
  operate_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '操作id'
  },
  operate_cont: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '操作记录'
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '操作内容'
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '操作人，用户id'
  },
  client_info: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '客户端信息',
    defaultValue: ''
  }
}, {
  freezeTableName: true
})

export default LogModel