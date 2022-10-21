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
  }
}, {
  freezeTableName: true
})

export default LogModel