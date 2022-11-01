import ImageModel from '../models/Image'
import { Bucket, Dict, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import BucketModel from '../models/Bucket'

interface Filter extends Page {
  name?: string
  visible?: boolean
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

    if (params.visible) {
      tmp.where.visible = params.visible
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
    // 计算占用存储和总数量
    const promise = data.items.map(async (item: any) => {
      let filter = {
        where: {
          bucket_id: item.id
        }
      }
      return {
        id: item.id,
        bucket_storage: await ImageModel.sum('img_size', filter),
        bucket_count: await ImageModel.count(filter)
      }
    })
    return {
      code: 200,
      message: '成功',
      data: {
        ...data,
        stats: await Promise.all(promise)
      }
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
  async update (@Body() params: Bucket, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await BucketModel.update({
      ...params
      }, {
        where: {
          id: params.id,
          uid: user.id
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


  /**
   * 详情
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/detail')
  async detail (@Body() params: { id: string }, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await BucketModel.findOne({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }
}