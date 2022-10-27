import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import moment from 'moment'
import RoleModel  from '../models/Role'
import { Role, User } from '../types'
import authorization from '../middlewares/authorization'
import UserModel from '../models/User'
import webtoken from 'jsonwebtoken'

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
        await UserModel.update({
          token: token
        }, {
          where: {
            id: user.id
          }
        })
        user.token = token
        return {
          code: 200,
          message: '登录成功',
          data: user
        }
      } else {
        return {
          code: 500,
          message: '登录失败',
          data: '账号和密码不匹配'
        }
      }
    }
    return {
      code: 500,
      message: '登录失败',
      data: '账号不存在'
    }
  }

  
  // 注册:还需要判断当前账号是否已经存在
  @Post('/register')
  async register(@Body({ required: true }) params: User) {
    return {
      code: 200,
      message: '注册成功',
      data: await UserModel.create(params)
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