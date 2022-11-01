import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { Role, User } from '../types'
import UserModel from '../models/User'
import LogModel from '../models/Log'
import HabitsModel from '../models/Habits'
import webtoken from 'jsonwebtoken'
import { LogEnum } from '../enum'
import { default_habits } from '../global.config'


@Controller('/')
class PublicController {
  // 登录
  @Post('/login')
  async login(@Body({ required: true }) params: User, @Header() header: any) {
    const tmp: User = {}
    if (params.phone) tmp.phone = params.phone
    if (params.email) tmp.email = params.email
    const user: any = await UserModel.findOne({
      where: {
        ...tmp
      }
    })
    if (user) {
      if (user.password === params.password) {
        const token = webtoken.sign({ data: user.id, role: user.role }, 'a1b2c3', { expiresIn: 60 * 60 * 24 })
        if (!user.status) {
          return {
            code: 500,
            message: '账号已被禁用',
            data: '账号已被禁用'
          }
        }
        await UserModel.update({
          token: token
        }, {
          where: {
            id: user.id
          }
        })
        user.token = token
        // 记录登录日志
        await LogModel.create({
          type: LogEnum.Login,
          operate_id: params.email || params.phone,
          operate_cont: user.username,
          content: '登录成功',
          uid: user.id
        })
        return {
          code: 200,
          message: '登录成功',
          data: user
        }
      } else {
        return {
          code: 500,
          message: '账号和密码不匹配',
          data: '账号和密码不匹配'
        }
      }
    }
    return {
      code: 500,
      message: '账号不存在',
      data: '账号不存在'
    }
  }

  
  // 注册:还需要判断当前账号是否已经存在
  @Post('/register')
  async register(@Body({ required: true }) params: User) {
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
    const data = await UserModel.create(params) as User
    await HabitsModel.create({
      ...default_habits,
      uid: data.id
    })
    return {
      code: 200,
      message: '注册成功',
      data: data
    }
  }

  
  // 找回密码
  @Get('/forget')
  async forget() {
    return {
      code: 200,
      message: '忘记密码',
      data: '找回密码成功'
    }
  }
}