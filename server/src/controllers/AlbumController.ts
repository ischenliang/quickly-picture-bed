import { Bucket, Dict, Log, Page, User, Album, Image } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header, Ctx } from 'koa-ts-controllers'
import AlbumModel from '../models/Album'
import ImageModel from '../models/Image'
import { Op, Sequelize } from 'sequelize'
import { Context } from 'koa'
import LogModel from '../models/Log'
import { useGetClientInfoByIp } from '../utils/global'
import UserModel from '../models/User'

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
  async create (@Body() params: Album, @CurrentUser() user: User, @Ctx() ctx: Context) {
    params.uid = user.id
    const data = await AlbumModel.create(params as any) as Album
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    await LogModel.create({
      type: 9,
      operate_id: `ID:${data.id}`,
      operate_cont: userTmp.email,
      content: '创建了相册',
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
   * @param params Album相册
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Album, @CurrentUser() user: User, @Ctx() ctx: Context) {
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 10,
      operate_id: `ID:${params.id}`,
      operate_cont: userTmp.email,
      content: '更新了相册',
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
  async delete (@Body() params: { id: string }, @CurrentUser() user: User, @Ctx() ctx: Context) {
    await ImageModel.update({
      album_id: ''
    }, {
      where: {
        album_id: params.id,
        uid: user.id
      }
    })
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 11,
      operate_id: `ID:${params.id}`,
      operate_cont: userTmp.email,
      content: '删除了相册',
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
   * 图片列表：需要先查询相册中以置顶的图片，然后再追加其他图片
   * @param params
   * @returns 
   */
  @Post('/images')
  async images (@Body() params: { id: string, page: number, size: number, name: string, tag: string }, @CurrentUser() user: User) {
    const tmp: any = {
      order: [
        ['sort', 'desc'],
        ['updatedAt', 'desc']
      ],
      where: {
        img_name: {
          [Op.like]: params.name ? `%${params.name}%` : '%%'
        },
        uid: user.id,
        album_id: params.id
      }
    }
    if (params.tag) {
      tmp.where.tags = {
        // 参考：https://blog.csdn.net/qq_2417580538/article/details/125617949
        [Op.like]: Sequelize.literal(`'%${params.tag}%'`)
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


  /**
   * 标签列表：需要先查询该相册的所有图片的tags
   * @param params
   * @returns 
   */
  @Post('/tags')
  async tags (@Body() params: { id: string }, @CurrentUser() user: User) {
    const images = await ImageModel.findAll({
      where: {
        album_id: params.id,
        uid: user.id
      },
      order: [
        ['sort', 'desc']
      ]
    }) as Image[]
    const tags: string[] = []
    images.forEach(image => {
      image.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    })
    return {
      code: 200,
      message: '成功',
      data: tags
    }
  }
}