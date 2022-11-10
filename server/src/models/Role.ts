import { DataTypes } from 'sequelize'
const moment = require('moment')
import seq from '../utils/seq'
/**
 * id: 角色主键 UUID
 * name：角色名称 String 唯一
 * priority：角色优先级 Integer
 * status：角色状态 Boolean
 * remark：角色备注 String
 * ctime：角色创建时间 String
 * mtime：角色更新时间 String
 */
const RoleModel = seq.define('role', {
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
    comment: '角色名称',
    unique: 'name'
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '角色排序'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '角色状态'
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
    comment: '角色备注'
  },
  ctime: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
    comment: '创建时间'
  },
  mtime: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
    comment: '修改时间'
  }
}, {
  freezeTableName: true
})

export default RoleModel