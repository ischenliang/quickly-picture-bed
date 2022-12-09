import BucketSourceModel from '../models/BucketSource'
import BucketSourceHistoryModel from '../models/BucketSourceHistory'
import { BucketSource, BucketSourceHistory, Page } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import { useRoleAuthorization } from '../middlewares/authorization'

interface Filter extends Page {
  name?: string
  status?: boolean
}

// 注意：这里将class名改为BucketSourceController则访问时会报404
@Controller('/bucketSource')
class BucketsourceController {
  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  async list(@Body() params: Filter) {
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        name: {
          [Op.like]: params.name ? `%${params.name}%` : '%%'
        }
      }
    }
    const data: any = {}
    if (params.status) {
      tmp.where.status = params.status
    }
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await BucketSourceModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await BucketSourceModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/create')
  @Flow([useRoleAuthorization])
  async create (@Body() params: BucketSource) {
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModel.create(params)
    }
  }


  /**
   * 更新
   * 更新时判断传入的config和数据库里的config是否一致，不一致则添加一条记录
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/update')
  @Flow([useRoleAuthorization])
  async update (@Body() params: BucketSource) {
    const tmp = await BucketSourceModel.findOne({
      where: {
        id: params.id
      }
    }) as BucketSource
    // 判断传入的config和数据库中的值是否一致
    if (tmp.config !== params.config || tmp.version !== params.version) {
      await BucketSourceHistoryModel.create({
        bs_id: params.id,
        config: params.config,
        config_old: tmp.config,
        version: params.version,
        version_old: tmp.version,
        remark: params.remark
      })
    }
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModel.update({
        ...params
      }, {
        where: {
          id: params.id
        },
        // 更新数据，不更新updatedAt字段
        silent: params.status
      })
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
      data: await BucketSourceModel.destroy({
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
      data: await BucketSourceModel.findOne({
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 切换状态
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/switch')
  @Flow([useRoleAuthorization])
  async switch (@Body() params: { id: string }) {
    const data = await BucketSourceModel.findOne({where: { id: params.id } }) as BucketSource
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModel.update({
        status: !data.status
      }, {
        where: {
          id: params.id
        },
        // 更新数据，不更新updatedAt字段
        silent: true
      })
    }
  }


  /**
   * 版本回滚:同时还需要删除该条历史记录
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/rollBack')
  @Flow([useRoleAuthorization])
  async rollBack (@Body() params: { hid: string, bid: string }) {
    const data = await BucketSourceHistoryModel.findOne({ where: { id: params.hid } }) as BucketSourceHistory
    const res = await BucketSourceModel.update({
      config: data.config_old,
      version: data.version_old
    }, {
      where: {
        id: params.bid
      },
      // 更新数据，不更新updatedAt字段
      silent: true
    })
    await BucketSourceHistoryModel.destroy({
      where: {
        id: params.hid
      }
    })
    return {
      code: 200,
      message: '成功',
      data: res
    }
  }
}