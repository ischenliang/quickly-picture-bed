import { Dict, Habits, Page, Setting, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import HabitsModel from '../models/Habits'

interface Filter extends Page {
  name?: string
}

@Controller('/habits')
class HabitsController {


  /**
   * 新建
   * @param params Habits用户习惯
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Habits, @CurrentUser() user: User) {
    params.uid = user.id
    return {
      code: 200,
      message: '成功',
      data: await HabitsModel.create(params)
    }
  }


  /**
   * 更新
   * @param params Habits用户习惯
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Habits, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await HabitsModel.update({
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
   * 详情
   * @param params Habits用户习惯
   * @returns 
   */
  @Post('/detail')
  async detail (@CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await HabitsModel.findOne({
        where: {
          uid: user.id
        }
      })
    }
  }
}