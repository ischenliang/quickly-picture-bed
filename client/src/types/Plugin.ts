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
export default class Plugin {
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
  installed (params: { status: boolean }) {
    return http('/plugin/installed', params)
  }
}