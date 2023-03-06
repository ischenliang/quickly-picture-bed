import { Sequelize, Dialect } from 'sequelize'

const conf = {
  host: '124.222.54.192',
  port: 3306, // 默认端口一般是3306
  // 使用什么数据库，使用类型转换将字符串转成Dialect，否则在严格模式下会报错
  dialect: 'mysql' as Dialect,
  define: {},
  // 不让sql语句在命令行终端输出
  logging: (sql: any) => {
    // console.log(sql)
  }
}
const seq = new Sequelize('picture-bed-backup', 'root', '100259', conf)

// 测试连接是否成功
// seq.authenticate().then(() => {
//   console.log('数据库连接成功')
// }).catch()

// 根据 model 自动创建表
seq
  .sync({
    alter: true, // alter：为true时更新表字段
    force: false // force:为true时强制删除表
  })
  .then()
  .catch()

export default seq