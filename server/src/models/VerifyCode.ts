import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const VerifyCodeModel = seq.define('verifycode', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    comment: 'uuid'
  },
  code: {
    type: DataTypes.BLOB,
    allowNull: false,
    comment: '验证码内容'
  },
  anser: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '验证码答案'
  },
  expire_at: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '验证码有效期'
  }
}, {
  freezeTableName: true
})

export default VerifyCodeModel