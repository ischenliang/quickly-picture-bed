import BucketSourceModel from '../models/BucketSource'
import { BucketSource, Page } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'

interface Filter extends Page {
  name?: string
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
  async create (@Body() params: BucketSource) {
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModel.create(params)
    }
  }


  /**
   * 更新
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: BucketSource) {
    return {
      code: 200,
      message: '成功',
      data: await BucketSourceModel.update({
      ...params
      }, {
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 删除
   * @param params BucketSource存储源
   * @returns 
   */
  @Post('/delete')
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
}