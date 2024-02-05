import { HabitsInter } from '@/typings/interface';
import http from '@/api';

/**
 * =========== 使用习惯管理 ===========
 * 针对每个用户使用改图床的习惯配置
 * ==============================
 */
export default class Habits {
  async create (params: HabitsInter) {
    return http('/habits/create', params)
  }
  update (params: HabitsInter) {
    return http('/habits/update', params)
  }
  detail () {
    return http('/habits/detail', {})
  }
  save (params: HabitsInter) {
    delete params.createdAt
    delete params.updatedAt
    if (params.id) {
      return this.update(params)
    }
    return this.create(params)
  }
}