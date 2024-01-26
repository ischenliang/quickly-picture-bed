import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs'
import { VerifyCodeService } from 'src/common/verifycode.service';
import { InjectModel } from '@nestjs/sequelize';
import { VerifyCode } from 'src/common/entities/verifyCode.entity';
import { Op } from 'sequelize';
import { TimeService } from 'src/common/time.service';
import * as moment from 'moment';
import { SmsCode } from 'src/common/entities/smsCode.entity';
import { map } from 'rxjs'
import { HttpService } from '@nestjs/axios';
import * as iconv from 'iconv-lite'


@Injectable()
export class ToolService {

  constructor (
    private verifyCodeService: VerifyCodeService,
    private timeService: TimeService,
    private httpService: HttpService,
    @InjectModel(VerifyCode) private verifyCodeModel: typeof VerifyCode,
    @InjectModel(SmsCode) private smsCodeModel: typeof SmsCode
  ) {}

  async upload(file, path) {
    // 解决中文乱码问题
    file.originalname = iconv.decode(file.originalname as any, 'utf8') || file.originalname
    // 目标目录，没有这个文件夹会自动创建
    const directory = join(__dirname, '../public/', path)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
    const dest = join(__dirname, '../public/', path, file.originalname)
    fs.writeFileSync(dest, file.buffer)
    return {
      name: file.originalname,
      img_url: path.replace(/^\//g, '') + file.originalname,
      hash: ''
    }
  }

  /**
   * 生成图形验证码
   * @param last_id 上一次id，首次传入"-"
   * @returns 
   */
  async imgCreate (last_id: string) {
    const { text, data } = this.verifyCodeService.generateImgCode()
    if (last_id !== '-') {
      await this.verifyCodeModel.destroy({
        where: {
          id: last_id
        }
      })
    }
    // 删除所有已过期的验证码
    await this.verifyCodeModel.destroy({
      where: {
        expire_at: {
          [Op.lt]: new Date()
        }
      }
    })
    // 生成最新的验证码
    const verifyCode = await this.verifyCodeModel.create({
      code: data,
      anser: text,
      expire_at: this.timeService.formatTime(moment().add(10, 'm'))
    })
    return {
      id: verifyCode.id,
      data
    }
  }

  /**
   * 图片验证码校验
   * @param param 
   * @returns 
   */
  async imgCheck (param: { id: number, anser: string }) {
    const data = await this.verifyCodeModel.findOne({
      where: {
        id: param.id
      }
    })
    if (data && this.timeService.diffTime(null, data.expire_at) <= 0) {
      const flag = data.anser.toUpperCase() === param.anser.toUpperCase()
      if (flag) {
        // 校验成功后需要将其状态改为已过期
        await this.verifyCodeModel.update({
          expire_at: this.timeService.formatTime(moment())
        }, {
          where: {
            id: param.id
          }
        })
        return {
          statusCode: 200,
          data: '校验成功'
        }
      }
      return {
        statusCode: 500,
        data: '校验失败'
      }
    }
    return {
      statusCode: 500,
      data: '验证码已过期，请重新生成'
    }
  }

  /**
   * 发送sms验证码
   * @param param 
   */
  async smsSend (param: { account: string, verify_code: string, verify_id: string, type: 'email' | 'phone' }) {
    const verifyCode = await this.verifyCodeModel.findOne({
      where: {
        id: param.verify_id
      }
    })
    if (verifyCode && this.timeService.diffTime(null, verifyCode.expire_at) <= 0) {
      const flag = verifyCode.anser.toUpperCase() === param.verify_code.toUpperCase()
      if (flag) {
        const code = this.verifyCodeService.generateSmsCode()
        if (param.type === 'email') {
          try {
            // 清除已过期的数据
            await this.smsCodeModel.destroy({
              where: {
                expire_at: {
                  [Op.lt]: new Date()
                }
              }
            })
            // 删除和用户account相关的数据
            // await this.smsCodeModel.destroy({
            //   where: {
            //     account: param.account
            //   }
            // })

            // 发送验证码
            await this.verifyCodeService.sendMail(code, param.account)
            // 创建新的验证码
            const smscode = await this.smsCodeModel.create({
              account: param.account,
              type: param.type,
              code: code,
              expire_at: this.timeService.formatTime(moment().add(3, 'm'))
            })
            return {
              id: smscode.id
            }
          } catch (error) {
            return {
              statusCode: 500,
              data: error.message
            }
          }
        } else {
          return {
            statusCode: 500,
            data: '暂不支持其他验证码功能'
          }
        }
      } else {
        return {
          statusCode: 500,
          data: '图形验证码不正确'
        }
      }
    }
    return {
      statusCode: 500,
      data: '验证码已过期，请重新生成'
    }
  }

  /**
   * 获取指定邮箱的最后一个验证码
   * Todo: 后续应该加上验证码的id
   * @param email 
   * @returns 
   */
  async smscodeCheck (email: string, code: string) {
    const data = await this.smsCodeModel.findOne({
      where: {
        account: email
      },
      raw: true
    })
    // 1. 判断验证码是否过期
    if (data && this.timeService.diffTime(null, data.expire_at) <= 0) {
      if (data.code === code) {
        // 校验成功后需要将其状态改为已过期
        await this.smsCodeModel.update({
          expire_at: this.timeService.formatTime(moment())
        }, {
          where: {
            account: email
          }
        })
        return {
          statusCode: 200,
          data: '校验成功'
        }
      }
      return {
        statusCode: 500,
        data: '校验失败'
      }
    }
    return {
      statusCode: 500,
      data: '验证码已过期，请重新生成'
    }
  }

  /**
   * 获取npm包的package.json
   * @param name 
   * @returns 
   */
  async npmRegistryPackage (name: string) {
    // 不能直接返回: 原因在于aliyun对象存储返回数据为空，然后nestjs会处理json数据，故出问题了报错
    // 这里如果直接返回需考虑接口返回的结果是否为空，如果为空则会出现下面的错误信息： 原因在于返回的结果是空，但是nestjs会帮我们转成json数据，故就报错了
    // [Nest] 11336  - 2023/09/14 15:43:27   ERROR [ExceptionsHandler] Converting circular structure to JSON
    // --> starting at object with constructor 'ClientRequest'
    // |     property 'socket' -> object with constructor 'TLSSocket'
    // --- property '_httpMessage' closes the circle
    // TypeError: Converting circular structure to JSON
    return this.httpService.get(`https://registry.npmjs.org/${name}`).pipe(map(res => {
      const { versions, readme, readmeFilename, time, ...pkgInfo } = res.data
      return {
        pkgInfo,
        versions: Object.keys(versions)
      }
    }))
  }
}
