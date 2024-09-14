import moment from 'moment'

/**
 * 格式化时间
 * @param time 时间 
 * @param patten 格式魔板
 * @returns 
 */
export function useFormatTime (time: any = null, patten = 'YYYY-MM-DD HH:mm:ss') {
  return moment(time ? time : moment()).format(patten)
}


/**
 * 比较两个时间
 * @param current 当前时间
 * @param target 目标时间
 * @param patten 比较类型
 * @returns 大于0：在当前时间之后 小于0：在当前时间之内
 */
export function useDiffTime (current: any, target: any, patten = 'm') {
  return moment(current ? current : moment()).diff(moment(target), patten as any)
}