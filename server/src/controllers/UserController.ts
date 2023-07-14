import { Dict, Page, User } from '@/types'
import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Op } from 'sequelize'
import UserModel from '../models/User'
import LogModel from '../models/Log'
import BucketModel from '../models/Bucket'
import ImageModel from '../models/Image'
import HabitsModel from '../models/Habits'
import { useRoleAuthorization } from '../middlewares/authorization'
import { default_habits } from '../global.config'
import { useMd5 } from '../utils/global'
import axios from 'axios'

interface Filter extends Page {
  username?: string
  role?: number
  [prop: string]: any
}

@Controller('/user')
class UserController {
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
      ],
      where: {
        username: {
          [Op.like]: params.username ? `%${params.username}%` : '%%'
        }
      }
    };
    // 针对其他的查询数据
    ['role'].forEach(item => {
      if (params[item]) {
        tmp.where[item] = params[item]
      }
    })
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
   * 新建：需要根据邮箱来判断当前用户是否已存在，并且还需要新建habits
   * @param params User用户
   * @returns 
   */
  @Post('/create')
  @Flow([useRoleAuthorization])
  async create (@Body() params: User) {
    const user = await UserModel.findOne({
      where: {
        email: params.email
      }
    })
    if (user) {
      return {
        code: 500,
        message: '账号已存在',
        data: '账号已存在'
      }
    }
    const data = await UserModel.create(params as any) as User
    await HabitsModel.create({
      ...default_habits,
      uid: data.id
    })
    return {
      code: 200,
      message: '成功',
      data: data
    }
  }


  /**
   * 更新
   * @param params User用户
   * @returns 
   */
  @Post('/update')
  @Flow([useRoleAuthorization])
  async update (@Body() params: User) {
    const tmp = JSON.parse(JSON.stringify(params))
    delete tmp.id
    return {
      code: 200,
      message: '成功',
      data: await UserModel.update({
        ...tmp
      }, {
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 重置密码
   * @param params User用户
   * @returns 
   */
  @Post('/resetPwd')
  @Flow([useRoleAuthorization])
  async resetPwd (@Body() params: { id: string }) {
    return {
      code: 200,
      message: '成功',
      data: await UserModel.update({
        password: useMd5('000000')
      }, {
        where: {
          id: params.id
        }
      })
    }
  }


  /**
   * 删除用户，应当还需要将用户关联的数据删除
   * @param params User用户
   * @returns 
   */
  @Post('/delete')
  @Flow([useRoleAuthorization])
  async delete (@Body() params: { id: string }) {
    const where = {
      where: {
        uid: params.id
      }
    }
    await LogModel.destroy(where)
    await ImageModel.destroy(where)
    await BucketModel.destroy(where)
    await HabitsModel.destroy(where)
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


  /**
   * 当前登录状态的用户
   * @param params User用户
   * @returns 
   */
  @Post('/current')
  async current (@CurrentUser() user: User) {
    return {
      code: 200,
      message: '成功',
      data: await UserModel.findOne({
        where: {
          id: user.id
        }
      })
    }
  }


  /**
   * 保存
   * @param params User用户
   * @returns 
   */
  @Post('/save')
  async save (@Body() params: User, @CurrentUser() current: User) {
    return {
      code: 200,
      message: '成功',
      data: await UserModel.update(params, {
        where: {
          id: current.id
        }
      })
    }
  }


  /**
   * 修改密码
   * @param params User用户
   * @returns 
   */
  @Post('/changePwd')
  async changePwd (@Body() params: { password: string, old_password: string }, @CurrentUser() current: User) {
    const tmp = await UserModel.findOne({
      where: {
        id: current.id
      }
    }) as User
    if (tmp.password !== params.old_password) {
      return {
        code: 500,
        message: '原密码错误，请重新输入',
        data: null
      }
    }
    return {
      code: 200,
      message: '成功',
      data: await UserModel.update({
        password: params.password
      }, {
        where: {
          id: current.id
        }
      })
    }
  }


  /**
   * 切换用户状态
   * @param params User用户
   * @returns 
   */
  @Post('/toggle')
  @Flow([useRoleAuthorization])
  async toggle (@Body() params: { id: string }) {
    const tmp = await UserModel.findOne({
      where: {
        id: params.id
      }
    }) as User

    return {
      code: 200,
      message: '成功',
      data: await UserModel.update({
        status: !tmp.status
      }, {
        where: {
          id: params.id
        },
        silent: true
      })
    }
  }

  // 1.1版本
  @Post('/chatgpt')
  async chatgpt (@Body({ required: true }) params: { prompt: string, userId: string, network: boolean }) {
    // const api = new ChatGPTAPI({
    //   apiKey: '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',
    //   apiBaseUrl: 'https://service-isex76rq-1257144987.jp.apigw.tencentcs.com/'
    // })
    // const res = await api.sendMessage('东北锅包肉的家常做法')
    return {
      code: 200,
      msg: '',
      data: 'res'
    }
  }
}