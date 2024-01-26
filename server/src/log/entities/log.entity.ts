import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/entities/user.entity";
import { ClientInfo } from "../dto/create-log.dto";

@Table({ tableName: 'log' })
export class Log extends Model<Log> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  id: number

  @Column({
    allowNull: false,
    comment: '日志类型'
  })
  type: number

  @Column({
    allowNull: false,
    comment: '操作记录id'
  })
  operate_id: number

  @Column({
    allowNull: false,
    comment: '操作记录内容'
    // 例如: 上传了图片[202210241507322.jpg]、更新了相册[哈哈哈哈]、登录成功
  })
  operate_cont: string

  @Column({
    allowNull: false,
    comment: '操作客户端信息',
    type: DataType.JSON
  })
  client_info: ClientInfo

  @Column({
    allowNull: false,
    comment: '用户id'
  })
  uid: number

  @Column({
    allowNull: false,
    comment: '用户邮箱'
  })
  email: string
}
