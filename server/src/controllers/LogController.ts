import { Bucket, Dict, Log, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header, Ctx } from 'koa-ts-controllers'
import seq from '../utils/seq'
import LogModel from '../models/Log'
import { Op } from 'sequelize'
import { Context } from 'koa'
import { useRoleAuthorization } from '../middlewares/authorization'
import { useGetClientInfoByIp } from '../utils/global';
import UserModel from '../models/User'

interface Filter extends Page {
  name?: string
}

@Controller('/log')
class LogController {
  /**
   * 所有数据列表：需要管理员角色查看
   * @returns 
   */
  @Post('/all')
  async all(@Body() params: Filter, @CurrentUser() user: User, @Header() header: any) {
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ]
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await LogModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await LogModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }
  

  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  async list(@Body() params: Filter, @CurrentUser() user: User, @Header() header: any) {
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        uid: user.id
      }
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await LogModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await LogModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }

  
  /**
   * 查询今日图片操作列表
   * @returns 
   */
   @Post('/listByDay')
   async listByDay(@Body() params: Filter, @CurrentUser() user: User, @Header() header: any) {
     const data: any = {}
     data.items = await LogModel.findAll({
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        uid: user.id,
        type: {
          [Op.or]: [2, 3, 4]
        },
        [Op.and]: [
          seq.Sequelize.where(
            seq.Sequelize.fn('DATE', seq.Sequelize.col('createdAt')),
            seq.Sequelize.literal('CURRENT_DATE')
          )
        ]
      }
    })
     return {
       code: 200,
       message: '成功',
       data: data
     }
   }


  /**
   * 贡献列表按天查询
   *  目前只统计图片操作
   * @returns 
   */
  @Post('/contributes')
  async contribute(@Body() params: Filter, @CurrentUser() user: User, @Header() header: any) {
    // 方式一
    // const data = await seq.query(`select DATE_FORMAT(createdAt,'%Y-%m-%d') date, COUNT('id') count
    //   from log
    //   WHERE uid='${user.id}'
    //   GROUP BY date`)

    // 方式二
    const data = await LogModel.findAll({
      where: {
        uid: user.id,
        type: {
          [Op.or]: [2, 3, 4]
        }
      },
      attributes: [
        [seq.Sequelize.fn('DATE_FORMAT', seq.Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
        [seq.Sequelize.fn('COUNT', 'id'), 'count']
      ],
      group: ['date']
    })
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params Log日志
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Log, @CurrentUser() user: User, @Ctx() ctx: Context) {
    params.uid = user.id
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    return {
      code: 200,
      message: '成功',
      data: await LogModel.create({
        ...params,
        client_info: {
          province,
          city,
          adcode,
          rectangle,
          ip: ctx.req_ip
        }
      })
    }
  }


  /**
   * 更新
   * @param params Log日志
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Log) {
    return {
      code: 200,
      message: '成功',
      data: await LogModel.update({
      ...params
      }, {
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 删除:需要根据角色来判断
   * @param params Log日志
   * @returns 
   */
  @Post('/delete')
  @Flow([useRoleAuthorization])
  async delete (@Body() params: { id: string }, @CurrentUser() user: User) {
    const where: any = {
      id: params.id,
    }
    if (user.role !== 10) {
      where.uid = user.id
    }
    return {
      code: 200,
      message: '成功',
      data: await LogModel.destroy({
        where: where
      })
    }
  }


  /**
   * 重新定位: 需要根据角色来判断
   * @param params Log日志
   * @returns 
   */
  @Post('/reLocate')
  @Flow([useRoleAuthorization])
  async reLocate (@Body() params: { id: string }, @CurrentUser() user: User) {
    // 先从数据库中获取到ip
    const log = await LogModel.findOne({
      where: {
        id: params.id
      }
    }) as Log
    // 重新获取客户端信息
    const client_info = await useGetClientInfoByIp(log.client_info.ip) as any

    // 更新数据
    return {
      code: 200,
      message: '成功',
      data: await LogModel.update({
        client_info: {
          ...client_info
        }
      }, {
        where: {
          id: params.id
        },
        silent: true
      })
    }
  }
}