import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header, Ctx } from 'koa-ts-controllers'
import { Role, User, VerifyCode, SmsCode } from '../types'
import UserModel from '../models/User'
import LogModel from '../models/Log'
import HabitsModel from '../models/Habits'
import webtoken from 'jsonwebtoken'
import { LogEnum } from '../enum'
import { default_habits } from '../global.config'
import VerifyCodeModel from '../models/VerifyCode'
import SmsCodeModel from '../models/SmsCode'
import { useDiffTime, useFormatTime } from '../utils/time'
import { Context } from 'koa'
import { useGetClientInfoByIp } from '../utils/global'

interface LoginParams extends User {
  verify_code?: string
  verify_id?: string
}

interface RegisterParams extends User {
  account?: string
  sms_code?: string
}

@Controller('/')
class PublicController {
  // 登录:还需要验证图形验证码是否正确
  @Post('/login')
  async login(@Body({ required: true }) params: LoginParams, @Header() header: any, @Ctx() ctx: Context) {
    const tmp: User = {}
    if (params.phone) tmp.phone = params.phone
    if (params.email) tmp.email = params.email
    // 1. 校验验证码
    const verifyCode = await VerifyCodeModel.findOne({
      where: {
        id: params.verify_id
      }
    }) as VerifyCode
    if (!(useDiffTime(null, verifyCode.expire_at) <= 0)) {
      return {
        code: 201,
        message: '图形验证码已过期',
        data: '图形验证码已过期'
      }
    }
    if (params.verify_code.toUpperCase() !== verifyCode.anser.toUpperCase()) {
      return {
        code: 201,
        message: '图形验证码错误',
        data: '图形验证码错误'
      }
    }
    // 2. 校验用户数据
    const user: any = await UserModel.findOne({
      where: {
        ...tmp
      }
    })
    if (user) {
      if (!user.status) {
        return {
          code: 500,
          message: '账号已被禁用',
          data: '账号已被禁用'
        }
      }
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
        // 记录登录日志
        const { province, city, adcode, rectangle } = await useGetClientInfoByIp(ctx.req_ip) as any
        await LogModel.create({
          type: LogEnum.Login,
          operate_id: params.email || params.phone,
          operate_cont: tmp.email || tmp.phone,
          content: '登录成功',
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

  
  // 注册:还需要判断当前账号是否已经存在，并且需要验证图形验证码是否正确
  @Post('/register')
  async register(@Body({ required: true }) params: RegisterParams) {
    /**
     * 1. 校验邮箱验证码
     *    1.1 首先判断验证码是否已过期
     *    1.2 其次判断内容是否匹配
     */
    const smsCode = await SmsCodeModel.findOne({
      where: {
        account: params.account
      }
    }) as SmsCode
    // 1.1 判断验证码是否已过期
    if (!(useDiffTime(null, smsCode.expire_at) <= 0)) {
      return {
        code: 500,
        message: '验证码已过期，请重新生成',
        data: '验证码已过期，请重新生成'
      }
    }
    // 1.2 判断内容是否匹配
    if (smsCode.code !== params.sms_code) {
      return {
        code: 500,
        message: '验证码不正确',
        data: '验证码不正确'
      }
    }
    
    /**
     * 2. 校验账号是否已存在
     */
    const user = await UserModel.findOne({
      where: {
        email: params.account
      }
    })
    if (user) {
      return {
        code: 500,
        message: '账号已存在',
        data: '账号已存在'
      }
    }

    /**
     * 3. 创建用户
     *    由于我们用户习惯也是和用户关联的，所以也需要创建用户习惯
     */
    const data = await UserModel.create({
      email: params.account,
      password: params.password
    }) as User
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
  @Post('/forget')
  async forget(@Body({ required: true }) params: RegisterParams) {
    /**
     * 1. 校验邮箱验证码
     *    1.1 首先判断验证码是否已过期
     *    1.2 其次判断内容是否匹配
     */
    const smsCode = await SmsCodeModel.findOne({
      where: {
        account: params.account
      }
    }) as SmsCode
    // 1.1 判断验证码是否已过期
    if (!(useDiffTime(null, smsCode.expire_at) <= 0)) {
      return {
        code: 500,
        message: '验证码已过期，请重新生成',
        data: '验证码已过期，请重新生成'
      }
    }
    // 1.2 判断内容是否匹配
    if (smsCode.code !== params.sms_code) {
      return {
        code: 500,
        message: '验证码不正确',
        data: '验证码不正确'
      }
    }

    
    /**
     * 2. 校验账号是否已存在
     */
    const user = await UserModel.findOne({
      where: {
        email: params.account
      }
    })
    if (!user) {
      return {
        code: 500,
        message: '账号不存在',
        data: '账号不存在'
      }
    }

    /**
     * 3. 更新密码
     */

    return {
      code: 200,
      message: '密码重置成功',
      data: await UserModel.update({
        password: params.password
      }, {
        where: {
          email: params.account
        }
      })
    }
  }
}