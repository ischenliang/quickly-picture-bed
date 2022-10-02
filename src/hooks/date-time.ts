import moment from 'moment'
/**
 * 格式化日期和时间
 * @param pattern 格式规则
 */
export function useFormat (datetime: string | Date, pattern: string = 'YYYY-MM-DD HH:mm:ss') {
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss')
}