import { Role } from '../enum'
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
const UserModel = seq.define('user', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '手机号',
    unique: 'phone'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '邮箱',
    unique: 'email'
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户昵称'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '密码'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '头像',
    defaultValue: '01'
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户角色',
    defaultValue: Role.Guest
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '个人简介'
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户职业'
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户性别'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户地址:省、市、区、街道地址',
    defaultValue: "['', '', '', '']"
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '登录token'
  }
}, {
  freezeTableName: true
})

export default UserModel