import { Bucket, Dict, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import BucketModel from '../models/Bucket'

interface Filter extends Page {
  name?: string
}

@Controller('/bucket')
class BucketController {
  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  async list(@Body() params: Filter, @CurrentUser() user: User) {
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        name: {
          [Op.like]: params.name ? `%${params.name}%` : '%%'
        },
        uid: user.id
      }
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await BucketModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await BucketModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Bucket, @CurrentUser() user: User) {
    params.uid = user.id
    return {
      code: 200,
      message: '成功',
      data: await BucketModel.create(params)
    }
  }


  /**
   * 更新
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Bucket) {
    return {
      code: 200,
      message: '成功',
      data: await BucketModel.update({
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
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/delete')
  async delete (@Body() params: { id: string }, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await BucketModel.destroy({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }
}