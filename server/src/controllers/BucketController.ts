import ImageModel from '../models/Image'
import { Bucket, BucketSource, Dict, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header, Ctx } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import BucketModel from '../models/Bucket'
import BucketSourceModel from '../models/BucketSource'
import LogModel from '../models/Log'
import { useGetClientInfoByIp } from '../utils/global'
import { Context } from 'koa'
import UserModel from '../models/User'

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
    }
    const { rows, count } = await BucketModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
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

    // 拿到当前类型的最新版本
    const versions = data.items.map(async (item: any) => {
      return {
        id: item.id,
        version: item.version,
        version_last: (await BucketSourceModel.findOne({
          attributes: ['version'],
          where: {
            type: item.type
          }
        }) as BucketSource).version
      }
    })

    return {
      code: 200,
      message: '成功',
      data: {
        ...data,
        stats: await Promise.all(promise),
        versions: await Promise.all(versions)
      }
    }
  }


  /**
   * 新建
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Bucket, @CurrentUser() user: User, @Ctx() ctx: Context) {
    params.uid = user.id
    const data = await BucketModel.create(params as any) as Bucket
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 6,
      operate_id: `ID:${data.id}`,
      operate_cont: userTmp.email,
      content: '创建了存储桶',
      uid: user.id,
      client_info: {
        province,
        city,
        adcode,
        rectangle,
        ip: ctx.req_ip
      }
    })
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 更新
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Bucket, @CurrentUser() user: User, @Ctx() ctx: Context) {
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 7,
      operate_id: `ID:${params.id}`,
      operate_cont: userTmp.email,
      content: '更新了存储桶',
      uid: user.id,
      client_info: {
        province,
        city,
        adcode,
        rectangle,
        ip: ctx.req_ip
      }
    })
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
  async delete (@Body() params: { id: string }, @CurrentUser() user: User, @Ctx() ctx: Context) {
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 8,
      operate_id: `ID:${params.id}`,
      operate_cont: userTmp.email,
      content: '删除了存储桶',
      uid: user.id,
      client_info: {
        province,
        city,
        adcode,
        rectangle,
        ip: ctx.req_ip
      }
    })
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


  /**
   * 切换状态
   * @param params Bucket存储桶
   * @returns 
   */
  @Post('/toggle')
  async toggle (@Body() params: { id: string }, @CurrentUser() user: User) {
    const tmp = await BucketModel.findOne({ where: { id: params.id } }) as Bucket
    return {
      code: 200,
      message: '成功',
      data: await BucketModel.update({
        visible: !tmp.visible
      }, {
        where: {
          id: params.id,
          uid: user.id
        },
        silent: true
      })
    }
  }
}