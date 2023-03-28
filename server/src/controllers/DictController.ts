import { Dict, Page } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import DictModel from '../models/Dict'
import { useRoleAuthorization } from '../middlewares/authorization'

interface Filter extends Page {
  name?: string
}

@Controller('/dict')
class DictController {
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
      const { rows, count } = await DictModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await DictModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params Dict字典
   * @returns 
   */
  @Post('/create')
  @Flow([useRoleAuthorization])
  async create (@Body() params: Dict) {
    return {
      code: 200,
      message: '成功',
      data: await DictModel.create(params as any)
    }
  }


  /**
   * 更新
   * @param params Dict字典
   * @returns 
   */
  @Post('/update')
  @Flow([useRoleAuthorization])
  async update (@Body() params: Dict) {
    return {
      code: 200,
      message: '成功',
      data: await DictModel.update({
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
   * @param params Dict存储源
   * @returns 
   */
  @Post('/delete')
  @Flow([useRoleAuthorization])
  async delete (@Body() params: { id: string }) {
    return {
      code: 200,
      message: '成功',
      data: await DictModel.destroy({
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
  async findByPro(@Body() params: { property: string, value: string }) {
    const data = await DictModel.findOne({
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
}