import { Controller, Get, Post, Put, Params, Body, Query, CurrentUser, Flow, Delete, State, Header } from 'koa-ts-controllers'
import { QiniuUploadConfig, QiniuFileManager, VerifyCode } from '@/types'
import { getUploadToken, deleteFile } from '../utils/qiniu'
import { generateVerifyCode } from '../utils/svg-captcha'
import VerifyCodeModel from '../models/VerifyCode'
import { useDiffTime, useFormatTime } from '../utils/time'
import moment from 'moment'

@Controller('/tool')
class ToolController {

  // 获取七牛yun的上传凭证
  @Post('/qiniuSign')
  async sign(@Body() config: QiniuUploadConfig) {
    const token = getUploadToken(config)
    return {
      code: 200,
      msg: '成功',
      data: {
        token: token
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
    let data: any = null
    if (params.last_id !== '-') {
      await VerifyCodeModel.destroy({
        where: {
          id: params.last_id
        }
      })
    }
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
}