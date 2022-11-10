import { Dict, Page, Setting } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import SettingModel from '../models/Setting'
import { useRoleAuthorization } from '../middlewares/authorization'

interface Filter extends Page {
  name?: string
}

@Controller('/setting')
class SettingController {
  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  @Flow([useRoleAuthorization])
  async list(@Body() params: Filter) {
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ]
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await SettingModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await SettingModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params Setting系统配置
   * @returns 
   */
  @Post('/create')
  @Flow([useRoleAuthorization])
  async create (@Body() params: Setting) {
    return {
      code: 200,
      message: '成功',
      data: await SettingModel.create(params)
    }
  }


  /**
   * 更新
   * @param params Setting系统配置
   * @returns 
   */
  @Post('/update')
  @Flow([useRoleAuthorization])
  async update (@Body() params: Setting) {
    return {
      code: 200,
      message: '成功',
      data: await SettingModel.update({
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
   * @param params Setting系统配置
   * @returns 
   */
  @Post('/delete')
  @Flow([useRoleAuthorization])
  async delete (@Body() params: { id: string }) {
    return {
      code: 200,
      message: '成功',
      data: await SettingModel.destroy({
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 查询是否有满足条件的数据
   * 使用场景：当某个字段是唯一时使用
   * @returns 
   */
  @Post('/findByPro')
  @Flow([useRoleAuthorization])
  async findByPro(@Body() params: { property: string, value: string }) {
    const data = await SettingModel.findOne({
      where: {
        [params.property]: params.value
      }
    })
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
  @Post('/default')
  async default(@Body() params: Filter) {
    const tmp = await SettingModel.findOne()
    return {
      code: 200,
      message: '成功',
      data: tmp
    }
  }
}