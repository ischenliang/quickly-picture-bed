import { Dict, Image, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header, Ctx } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import ImageModel from '../models/Image'
import LogModel from '../models/Log'
import { Context } from 'koa'
import { useGetClientInfoByIp } from '../utils/global'
import UserModel from '../models/User'


interface Filter extends Page {
  img_name?: string
  bucket_id?: string
  album_id?: string
  [prop: string]: any
}

@Controller('/image')
class ImageController {
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
        img_name: {
          [Op.like]: params.img_name ? `%${params.img_name}%` : '%%'
        },
        uid: user.id
      }
    };
    ['bucket_id', 'album_id'].forEach(item => {
      if (params[item]) {
        tmp.where[item] = params[item]
      }
    })
    const data: any = {}
    if (params.page) {
      tmp.limit = params.size
      tmp.offset = params.page ? (params.page - 1) * params.size : 0
    }
    const { rows, count } = await ImageModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 新建
   * @param params Image图片
   * @returns 
   */
  @Post('/create')
  async create (@Body() params: Image, @CurrentUser() user: User, @Ctx() ctx: Context) {
    params.uid = user.id
    const data = (await ImageModel.create(params as any) as Image)
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    await LogModel.create({
      type: 2,
      operate_id: `ID:${data.id}`,
      operate_cont: userTmp.email,
      content: `上传了图片: ${data.img_name}`,
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
   * @param params Image图片
   * @returns 
   */
  @Post('/update')
  async update (@Body() params: Image, @CurrentUser() user: User, @Ctx() ctx: Context) {
    // 先更新数据
    await ImageModel.update({
      ...params
    }, {
      where: {
        id: params.id,
        uid: user.id
      },
      silent: params.slient
    })
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 4,
      operate_id: `ID:${params.id}`,
      operate_cont: userTmp.email,
      content: `更新了图片: ${params.img_name}`,
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
      data: await ImageModel.findOne({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }


  /**
   * 删除
   * @param params Image图片
   * @returns 
   */
  @Post('/delete')
  async delete (@Body() params: { id: string }, @CurrentUser() user: User, @Ctx() ctx: Context) {
    const tmp = (await ImageModel.findOne({ where: { id: params.id, uid: user.id } }) as Image)
    // 记录登录日志
    const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
    const userTmp = await UserModel.findOne({
      where: {
        id: user.id
      }
    }) as User
    await LogModel.create({
      type: 3,
      operate_id: `ID:${params.id}`,
      operate_cont: userTmp.email,
      content: `删除了图片: ${tmp.img_name}`,
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
      data: await ImageModel.destroy({
        where: {
          id: params.id,
          uid: user.id
        }
      })
    }
  }
}