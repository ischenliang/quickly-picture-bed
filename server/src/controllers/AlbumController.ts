import { Bucket, Dict, Log, Page, User, Album } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import AlbumModel from '../models/Album'
import ImageModel from '../models/Image'
import { Op } from 'sequelize'

interface Filter extends Page {
  name?: string
  desc?: string
  sort?: string
  order?: string
}

@Controller('/album')
class AlbumController {
  /**
   * 列表
   * @returns 
   */
  @Post('/list')
  async list(@Body() params: Filter, @CurrentUser() user: User) {
    const tmp: any = {
      order: [
        [params.sort || 'updatedAt', params.order || 'desc']
      ],
      where: {
        uid: user.id,
        name: {
          [Op.like]: params.name ? `%${params.name}%` : '%%'
        },
        desc: {
          [Op.like]: params.desc ? `%${params.desc}%` : '%%'
        },
      }
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
    }
    const { rows, count } = await AlbumModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    // 计算数量
    const promises = data.items.map(async (item: any) => {
      let filter = {
        where: {
          album_id: item.id
        }
      }
      return {
        id: item.id,
        count: await ImageModel.count(filter)
      }
    })
    return {
      code: 200,
      message: '成功',
      data: {
        ...data,
        stats: await Promise.all(promises)
      }
    }
  }

  /**
   * 新建
   * @param params Album相册
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Album, @CurrentUser() user: User) {
    params.uid = user.id
    return {
      code: 200,
      message: '成功',
      data: await AlbumModel.create(params)
    }
  }


  /**
   * 更新
   * @param params Album相册
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Album, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await AlbumModel.update({
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
   * 删除: 需要将已关联该相册的图片更新为空
   * @param params
   * @returns 
   */
  @Post('/delete')
  async delete (@Body() params: { id: string }, @CurrentUser() user: User) {
    await ImageModel.update({
      album_id: ''
    }, {
      where: {
        album_id: params.id,
        uid: user.id
      }
    })
    return {
      code: 200,
      message: '成功',
      data: await AlbumModel.destroy({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }


  /**
   * 详情
   * @param params
   * @returns 
   */
  @Post('/detail')
  async detail (@Body() params: { id: string }, @CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await AlbumModel.findOne({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }


  /**
   * 详情
   * @param params
   * @returns 
   */
  @Post('/images')
  async images (@Body() params: { id: string, page: number, size: number }, @CurrentUser() user: User) {
    const tmp: any = {
      order: [
        ['add_time', 'desc']
      ],
      where: {
        uid: user.id,
        album_id: params.id
      }
    }
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
      const { rows, count } = await ImageModel.findAndCountAll(tmp)
      data.total = count
      data.items = rows
    } else {
      data.items = await ImageModel.findAll(tmp)
    }
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }
}