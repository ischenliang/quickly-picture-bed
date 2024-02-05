import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header, Ctx } from 'koa-ts-controllers'
import { QiniuUploadConfig, QiniuFileManager, VerifyCode, AliUploadConfig, TencentUploadConfig, UpyunUploadConfig } from '@/types'
import { getUploadToken, deleteFile } from '../utils/qiniu'
import useSendMail, { useGenerateCode } from '../utils/nodemailer'
import { generateVerifyCode } from '../utils/svg-captcha'
import VerifyCodeModel from '../models/VerifyCode'
import SmsCodeModel from '../models/SmsCode'
import { useDiffTime, useFormatTime } from '../utils/time'
import moment from 'moment'
import { Op } from 'sequelize'
import { getCosSignature, getSingnature, getUpyunSignature } from '../utils/aliyun'
// @ts-ignore
import { Context } from 'koa'
import path from 'path'
import fse from 'fs-extra'
import { PassThrough, Readable } from 'stream'

function EventStream() { 
  Readable.call(this,arguments);
  return ''
}
EventStream.prototype = new Readable();
EventStream.prototype._read = function(data){
}
const sse = (stream: any, event : any, data: any) => {
  return stream.push(`event:${ event }\ndata: ${ JSON.stringify(data) }\n\n`)
}

@Controller('/tool')
class ToolController {

  // 获取七牛yun的上传凭证
  @Post('/qiniuSign')
  async qiniuSign(@Body() config: QiniuUploadConfig) {
    const token = getUploadToken(config)
    return {
      code: 200,
      msg: '成功',
      data: {
        token: token
      }
    }
  }

  // 获取阿里云oss的上传凭证
  @Post('/aliSign')
  async aliSign(@Body() config: AliUploadConfig) {
    const res = getSingnature(config)
    return {
      code: 200,
      msg: '成功',
      data: {
        ...res
      }
    }
  }

  // 获取腾讯云cos的上传凭证
  @Post('/tencentSign')
  async tencentSign(@Body() config: TencentUploadConfig) {
    const res = getCosSignature(config)
    return {
      code: 200,
      msg: '成功',
      data: {
        ...res
      }
    }
  }

  // 获取又拍云USS的上传凭证
  @Post('/upyunSign')
  async upyunSign(@Body() config: UpyunUploadConfig) {
    const res = getUpyunSignature(config)
    return {
      code: 200,
      msg: '成功',
      data: {
        ...res
      }
    }
  }

  // 删除七牛云的文件
  @Post('/deleteFile')
  async fileDelete(@Body() config: QiniuFileManager) {
    try {
      const res = await deleteFile(config)
      console.log(res)
      return {
        code: 200,
        msg: '删除成功',
        data: {}
      }
    } catch (error) {
      return {
        code: 500,
        msg: '删除失败',
        data: error.error
      }
    }
  }


  /**
   * 生成图形验证码
   *  1：判断传入的last_id是否等于"-"
   *    等于：直接生成
   *    不等于：先删除last_id对应的数据，再生成新数据
   *  避免造成很多无用数据
   */
  @Post('/imgCreate')
  async img(@Body({ required: true }) params: { last_id: string }) {
    const res: { text: string, data: string } = generateVerifyCode()
    // useSendMail('23456', 'itchenliang@163.com')
    let data: any = null
    if (params.last_id !== '-') {
      await VerifyCodeModel.destroy({
        where: {
          id: params.last_id
        }
      })
    }
    // 删除所有已过期的验证码: 过期时间在当前时间之前的数据都认为已经过期
    await VerifyCodeModel.destroy({
      where: {
        expire_at: {
          [Op.lt]: new Date()
        }
      }
    })

    data = await VerifyCodeModel.create({
      code: res.data,
      anser: res.text,
      expire_at: useFormatTime(moment().add(10, 'm'))
    })
    return {
      code: 200,
      message: '验证码生成成功，十分钟内有效',
      data: {
        code: data.code,
        id: data.id
      }
    }
  }
 
 
  /**
  * 校验图形验证码
  *  1: 根据传入的config中的id去查找数据
  *  2：将查找好的数据的expire_at和当前时间对比，在当前时间之后代表有效
  *  3: 有效后再判断config中的anser和查找的数据的anser是否一致
  *     为了不区分大小写，所以都统一使用toUppercase()后再比较
  */
  @Post('/imgCheck')
  async check(@Body({ required: true }) Params: { id: string, anser: string }) {
    const data = (await VerifyCodeModel.findOne({
      where: {
        id: Params.id
      }
    }) as VerifyCode)
    if (useDiffTime(null, data.expire_at) <= 0) {
      const flag = data.anser.toUpperCase() === Params.anser.toUpperCase()
      return {
        code: flag ? 200 : 500,
        msg: flag ? '校验成功' : '校验失败',
        data: {}
      }
    }
    return {
      code: 500,
      message: '验证码已过期，请重新生成',
      data: {}
    }
  }

  
 
 
  /**
  * 短信验证码 | 邮箱验证码
  *   1. 先校验图形验证码是否正确
  *   2. 正确：生成验证码
  *   3. 判断type，根据type做处理
  *   3. 先删除数据库中的account相关的数据
  *   4. 发送验证码
  */
  @Post('/smsSend')
  async smsSend(@Body({ required: true }) params: { account: string, verify_code: string, verify_id: string, type: string }) {
    const data = (await VerifyCodeModel.findOne({
      where: {
        id: params.verify_id
      }
    }) as VerifyCode)
    if (useDiffTime(null, data.expire_at) <= 0) {
      const flag = data.anser.toUpperCase() === params.verify_code.toUpperCase()
      if (flag) {
        const code = useGenerateCode()
        if (params.type === 'email') {
          try {
            const flag = await useSendMail(code, params.account)
            if (flag) {
              // 清除已经过期的数据
              await SmsCodeModel.destroy({
                where: {
                  expire_at: {
                    [Op.lt]: new Date()
                  }
                }
              })
              // 删除和用户account相关的数据
              await SmsCodeModel.destroy({ where: { account: params.account } })
              await SmsCodeModel.create({
                account: params.account,
                type: params.type,
                code: code,
                expire_at: useFormatTime(moment().add(3, 'm'))
              })
              return {
                code: 200,
                message: '验证码发送成功',
                data: '验证码发送成功'
              }
            }
          } catch (error) {
            return {
              code: 500,
              message: error.message || error.msg,
              data: error.message || error.msg
            }
          }
        } else {
          return {
            code: 500,
            message: '暂不支持其他验证码功能',
            data: '暂不支持其他验证码功能'
          }
        }
      }
      return {
        code: 500,
        message: '图形验证码不正确',
        data: '图形验证码不正确'
      }
    }
    return {
      code: 500,
      message: '验证码已过期，请重新生成',
      data: '图形验证码已过期，请重新生成'
    }
  }

  /**
   * 本地存储桶图片上传
   */
  @Post('/upload')
  async upload(@Ctx() ctx: Context, @Body({ required: true }) params: { path: string }) {
    const file: any = ctx.request.files.file
    if (!file) {
      return {
        code: 500,
        message: '未选择上传图片',
        data: '未选择上传图片'
      }
    }
    const { name, path: filePath } = file
    // 目标目录，没有这个文件夹会自动创建
    const dest = path.join(__dirname, '../public/', params.path)
    await fse.move(filePath, dest) // 移动文件
    return {
      code: 200,
      message: '成功',
      data: {
        name: name,
        img_url: '/' + params.path.replace(/^\//g, ''),
        hash: ''
      }
    }
  }

  /**
   * 连天测试
   * @param ctx 
   * @param params 
   */
  @Get('/test')
  async test() {
    return {
      code: 200,
      message: '成功',
      data: '成功啦'
    }
  }
}