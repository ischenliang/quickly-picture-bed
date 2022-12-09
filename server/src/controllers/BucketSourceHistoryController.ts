import BucketSourceModelHistory from '../models/BucketSourceHistory'
import { BucketSourceHistory, Page } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import { useRoleAuthorization } from '../middlewares/authorization'

interface Filter extends Page {
  bs_id?: string
}

// 注意：这里将class名改为BucketSourceController则访问时会报404
@Controller('/bucketSourceHistory')
class BucketsourceHistoryController {
  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  async list(@Body() params: Filter) {
    const tmp: any = {
      attributes: ['id', 'version', 'version_old', 'updatedAt', 'bs_id', 'remark'],
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        bs_id: params.bs_id
      }
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await BucketSourceModelHistory.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await BucketSourceModelHistory.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 删除
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/delete')
  @Flow([useRoleAuthorization])
  async delete (@Body() params: { id: string }) {
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModelHistory.destroy({
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 详情
   * @param params
   * @returns 
   */
  @Post('/detail')
  @Flow([useRoleAuthorization])
  async detail (@Body() params: { id: string }) {
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModelHistory.findOne({
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 版本回退 | 回滚
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/roolBack')
  @Flow([useRoleAuthorization])
  async switch (@Body() params: { id: string }) {
    const data = await BucketSourceModelHistory.findOne({where: { id: params.id } }) as BucketSourceHistory
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModelHistory.update({
        // status: !data.status
      }, {
        where: {
          id: params.id
        },
        // 更新数据，不更新updatedAt字段
        silent: true
      })
    }
  }
}