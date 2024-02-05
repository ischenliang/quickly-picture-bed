import { Setting } from '../types';
import SettingModel from '../models/Setting';
import nodemailer from 'nodemailer'

/**
 * 发送邮件
 * @param text 验证码
 * @param to 收件人邮箱
 */
export default async function useSendMail (text: string, to: string, subject: string = 'LightFastPicture') {
  const res = await SettingModel.findOne() as Setting
  const { mail_user, mail_pass } = res.system
  var user = mail_user // 自己的邮箱
  var pass = mail_pass // 邮箱授权码
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
      reject(new Error('为配置邮件服务'))
    }
  })
}


/**
 * 生成随机验证码
 * @param len 验证码长度
 * @returns 
 */
export function useGenerateCode (len: number = 6) {
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let str = ''
  for (var i = 0; i < len; i++) {
    var num = Math.round(Math.random() * (9 - 0) + 0)
    str += arr[num]
  }
  return str;
}