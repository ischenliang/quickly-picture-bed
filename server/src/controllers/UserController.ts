import { Dict, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import UserModel from '../models/User'

interface Filter extends Page {
  nickname?: string
}

@Controller('/user')
class UserController {
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
        nickname: {
          [Op.like]: params.nickname ? `%${params.nickname}%` : '%%'
        }
      }
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await UserModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await UserModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params User用户
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: User) {
    return {
      code: 200,
      message: '成功',
      data: await UserModel.create(params)
    }
  }


  /**
   * 更新
   * @param params User用户
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: User) {
    return {
      code: 200,
      message: '成功',
      data: await UserModel.update({
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
   * @param params User用户
   * @returns 
   */
  @Post('/delete')
  async delete (@Body() params: { id: string }) {
    return {
      code: 200,
      message: '成功',
      data: await UserModel.destroy({
        where: {
          id: params.id
        }
      })
    }
  }
}