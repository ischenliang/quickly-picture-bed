import { Bucket, Dict, Log, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import LogModel from '../models/Log'

interface Filter extends Page {
  name?: string
}

@Controller('/log')
class LogController {
  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  async list(@Body() params: Filter, @CurrentUser() user: User, @Header() header: any) {
    console.log(header)
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
   * 新建
   * @param params Log日志
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Log, @CurrentUser() user: User) {
    params.uid = user.id
    return {
      code: 200,
      message: '成功',
      data: await LogModel.create(params)
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
   * 删除
   * @param params Log日志
   * @returns 
   */
  @Post('/delete')
  async delete (@Body() params: { id: string }, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await LogModel.destroy({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }
}