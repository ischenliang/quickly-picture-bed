import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const SmsCodeModel = seq.define('smscode', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  account: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '账号，邮箱或者手机号'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '类别，可选email|phone'
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '验证码内容'
  },
  expire_at: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '验证码有效期'
  }
}, {
  freezeTableName: true
})

export default SmsCodeModel