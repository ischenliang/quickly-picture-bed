import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')
/**
 * 格式化日期和时间
 * @param pattern 格式规则
 */
export function useFormat (datetime: string | Date, pattern: string = 'YYYY-MM-DD HH:mm:ss') {
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss')
}


/**
 * 根据时间格式化生成文件名
 *   方式一：时间 + 随机数
 *   方式二：时间 + 时间戳
 *   方式三：时间戳 + 随机数
 *  @param type 生成文件名的方式: random | timestamp | timestampr
 *  @returns 
 */
export function useFileName (type = 'random') {
  const randomNum = Math.floor(Math.random() * 900) + 100 // 生成一个3位随机数
  if (type === 'random') {
    return moment().format('YYYYMMDDHHmmss') + randomNum + Math.floor(Math.random() * 10)
  }
  if (type === 'timestamp') {
    return moment().format('YYYYMMDDHHmmss') + moment().format('x')
  }
  if (type === 'timestampr') {
    return moment().format('x') + randomNum + Math.floor(Math.random() * 10)
  }
}

/**
 * 获取距离当前时间的相对时间
 * @param time 
 * @returns 
 */
export function useFromNow (time) {
  return moment(time).fromNow()
}
