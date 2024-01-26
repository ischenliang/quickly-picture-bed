import { Injectable } from "@nestjs/common";
import * as svgCaptcha from 'svg-captcha'
import * as nodemailer from 'nodemailer'
import { VerifyCode } from "./entities/verifyCode.entity";
import { InjectModel } from "@nestjs/sequelize";
import { SmsCode } from "./entities/smsCode.entity";

interface SvgCaptchaConfig {
  size: number // 随机验证码长度
  noise: number // 干扰线数量
  ignoreChars: string // 忽略容易造成勿扰的字符
  color: boolean // 颜色是否多变
  background: string // 背景色
  fontSize: number // 字体大小
  width: number // 宽度
  height: number // 高度
}

@Injectable()
export class VerifyCodeService {
  constructor (@InjectModel(VerifyCode) private verifyCodeModel: typeof VerifyCode, @InjectModel(SmsCode) private smsCodeModel: typeof SmsCode) {}
  /**
   * 发送邮件
   * @param text 验证码
   * @param to 收件人邮箱
   * @param subject 标题
   * @returns 
   */
  sendMail (text: string, to: string, subject: string = 'LightFastPicture') {
    var user = '1825956830@qq.com' // 自己的邮箱
    var pass = 'stjflvegjjumbbfa' // 邮箱授权码
    let transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      //配置发送者的邮箱服务器和登录信息
      // service:'qq', // 163、qq等
      auth: {
        user: user, // 用户账号
        pass: pass, //授权码,通过QQ获取
      },
    })
    return new Promise((resolve, reject) => {
      if (pass && user) {
        transporter.sendMail({
          from: `<${user}>`,
          to: `<${to}>`,
          subject: subject,
          html: `【LightFastPicture】验证码：<span style="color: #409eff;text-decoration: underline;">${text}</span>，有效期3分钟，如非本人操作，请忽略此消息。`,
        }).then(() => {
          resolve(true)
        }).catch(error => {
          reject(error)
        })
      } else {
        reject(new Error('未配置邮件服务'))
      }
    })
  }

  /**
   * 生成随机验证码
   * @param len 验证码长度
   * @returns 
   */
  generateSmsCode (len: number = 6): string {
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let str = ''
    for (var i = 0; i < len; i++) {
      var num = Math.round(Math.random() * (9 - 0) + 0)
      str += arr[num]
    }
    return str;
  }

  /**
   * 生成图形验证码：随机生成文字验证码和算数验证码
   * @param config 图形验证码配置
   */
  generateImgCode (config: SvgCaptchaConfig = {
    size: 4,
    width: 100,
    height: 40,
    fontSize: 38,
    color: true,
    ignoreChars: '0o1iIl',
    noise: 2, // 干扰线数量
    background: '#e2e9f1'
  }): { text: string, data: string } {
    const captcha = Math.random() < 0.5 ? svgCaptcha.create(config) : svgCaptcha.createMathExpr(config)
    const data = Buffer.from(captcha.data).toString('base64')
    return {
      text: captcha.text,
      data: 'data:image/svg+xml;base64,' + data
    }
  }
}