import { PageReq } from '@/typings/req-res';
import { LogInter } from '@/typings/interface';
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
}


/**
 * =========== 日志管理 || 动态管理 ===========
 * 用于对用户在本系统上的所有操作日志记录，主要记录系统操作和图片操作
 * ===========================================
 */
export default class Log {
  create (params: LogInter) {
    return http('/log/create', params)
  }
  delete (id: string) {
    return http('/log/delete', { id })
  }
  update (params: LogInter) {
    return http('/log/update', params)
  }
  find (params: Filter) {
    return http('/log/list', params)
  }
  contributes (params: Filter) {
    return http('/log/contributes', params)
  }
  all (params: Filter) {
    return http('/log/all', params)
  }
  detail (id: string) {
    return http('/log/detail', { id })
  }
  today () {
    return http('/log/listByDay', {})
  }
  reLocate (id: string) {
    return http('/log/reLocate', { id })
  }
  // 获取banner
  banner (type: 'admin' | 'user' = 'user') {
    return http('/stats/banner', { type })
  }
  // 近期动态
  rencentLog () {
    return http('/stats/rencentLog', {})
  }
  // 占比数据
  percentData (type: 'admin' | 'user' = 'user') {
    return http('/stats/percentData', { type })
  }
}