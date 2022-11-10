import { DataTypes } from 'sequelize'
import seq from '../utils/seq'

const DictModel = seq.define('dict', {
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
    comment: '字典名称'
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '字典编码：唯一',
    unique: 'code'
  },
  values: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: '字典内容'
  }
}, {
  freezeTableName: true
})

export default DictModel