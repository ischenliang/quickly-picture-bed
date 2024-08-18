import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Crypto } from './user/entities/crypto.entity';
import { pki, util, md } from 'node-forge'
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { ToolService } from './tool/tool.service';
import { LogService } from './log/log.service';
import { LogType } from './log/dto/create-log.dto';
import { TimeService } from './common/time.service';
import { SettingService } from './setting/setting.service';
import { SmsCode } from './common/entities/smsCode.entity';

function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 格式化相应
 * @param code 
 * @param data 
 * @returns 
 */
function parseResponse (code: 200 | 500, data: any) {
  return {
    statusCode: code,
    data: data
  }
}

@Injectable()
export class AppService {
  constructor (
    @InjectModel(Crypto) private cryptoModel: typeof Crypto,
    @InjectModel(SmsCode) private smsCodeModel: typeof SmsCode,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly toolService: ToolService,
    private readonly logService: LogService,
    private readonly timeService: TimeService,
    private readonly settingService: SettingService,
  ) {}

  getHello(): string {
    return 'Welcome to Light Fast Picture Restful Api!';
  }

  /**
   * 验证码登录
   * @param email 
   * @param sms_code 
   * @returns 
   */
  private async verifyLogin (email: string, sms_code: string, ip: string) {
    const smscode = await this.toolService.smscodeCheck(email, sms_code)
    const existUser = await this.userService.findOneByEmail(email)
    if (smscode.statusCode === 200) {
      if (existUser) {
        if (!existUser.status) {
          return { statusCode: 500, data: '账号已被禁用' }
        }
        const token = await this.authService.login(existUser)
        // 6. 创建登录日志
        await this.logService.create({
          type: LogType.Login,
          operate_id: existUser.id,
          operate_cont: `登录成功[${existUser.email}]`
        }, ip, existUser.id)
        return {
          token: token.access_token,
          data: existUser
        }
      }
      return {
        statusCode: 500,
        data: '账号不存在'
      }
    }
    return smscode
  }

  /**
   * 密码登录
   * @param param 
   * @param ip 
   * @returns 
   */
  private async passwordLogin (param: any, ip: string) {
    const { email, password, verify_id, verify_code, label } = param
    // 1. 判断验证码是否正确
    const captchaData = await this.authService.validateCaptcha(verify_id, verify_code)
    if (captchaData.statusCode !== 200) {
      return captchaData
    }
    // 2. 判断该邮箱是否已存在用户
    const existUser = await this.userService.findOneByEmail(email)
    if (!existUser) {
      return parseResponse(500, '账号不存在')
    }
    // 3. 解密密码
    const { data, ...res } = await this.decodeData(password, label, ip)
    if (data) {
      // 4. 验证邮箱和密码是否匹配
      const user = await this.authService.validateUser(email, data)
      if (!user) {
        return parseResponse(500, '账号和密码不正确')
      }
      if (!user.status) {
        return parseResponse(500, '账号已被禁用')
      }
      // 5. 生成token
      const { access_token } = await this.authService.login(user)
      // 6. 创建登录日志
      await this.logService.create({
        type: LogType.Login,
        operate_id: user.id,
        operate_cont: `登录成功[${user.email}]`
      }, ip, user.id)
      // 7. 返回结果
      return {
        token: access_token,
        data: user
      }
    } else {
      return res
    }
  }

  /**
   * 登录
   * @param param 请求体
   * @param ip 客户端ip
   * @returns 
   */
  async login (param, ip) {
    const { email, type, sms_code } = param
    switch (type) {
      // 验证码登录
      case 'verify_code':
        return await this.verifyLogin(email, sms_code, ip)
      // 密码登录
      case 'password':
      default: 
        const data = await this.passwordLogin(param, ip)
        return data
    }
  }

  /**
   * 注册
   * @param param 
   * @returns 
   */
  async register (param, ip: string) {
    try {
      const setting = await this.settingService.findOne()
      if (!setting.system.enable_register) {
        return {
          statusCode: 500,
          data: '注册功能已关闭，请联系管理员开启'
        }
      }
      /**
       * 1. 校验邮箱验证码
       *    1.1 首先判断验证码是否已过期
       *    1.2 其次判断内容是否匹配
       */
      const smsCode = await this.smsCodeModel.findOne({
        where: {
          account: param.account
        },
        order: [['updatedAt', 'desc']]
      })
      // 1.1、判断内容是否匹配
      if (!smsCode || smsCode.code !== param.sms_code) {
        return {
          statusCode: 500,
          data: '验证码不正确'
        }
      }
      const diff = this.timeService.diffTime(new Date(), smsCode.expire_at)
      // 1.2、判断验证码是否已过期
      if (smsCode && diff >= 0) {
        return {
          statusCode: 500,
          data: '验证码已过期，请重新生成'
        }
      }
  
      /**
       * 2. 创建用户
       */
      // 解密密码
      const { password, label } = param
      const { data: password_dec, ...res } = await this.decodeData(password, label, ip)
      if (password_dec) {
        const data = await this.userService.create({
          email: param.account,
          password: password_dec,
          role: 1,
          username: param.account,
          avatar: '星座_白羊座'
        })
        // 生成日志
        return data
      }
      return res
    } catch (error) {
      return {
        statusCode: 500,
        data: error.message || error
      }
    }
  }

  /**
   * 生成公钥私钥对
   * @param req_ip 请求客户端ip
   * @returns 
   */
  async generateCryptoKey (req_ip) {
    try {
      const bits = 1024, type = 'RSA-OAEP'
      // 1. 生成密钥对
      const keypair = pki.rsa.generateKeyPair({ bits: bits, workers: 2 })
      const publicKey = pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72).replace(/\r/g, '')
      const privateKey = pki.privateKeyToPem(keypair.privateKey, 72).replace(/\r/g, '')
      const label = `${Date.now()}${generateRandom(100000, 10000)}`
      // 2. 保存到数据库
      await this.cryptoModel.create({
        public_key: publicKey,
        private_key: privateKey,
        label: label,
        type: type,
        bits: bits + '',
        generate_ip: req_ip,
        is_valid: false
      })
      return {
        public_key: publicKey,
        label: label
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        data: '生成失败，请重试！'
      }
    }
  }

  /**
   * 解密内容
   * @param data 
   * @param label 
   * @param ip 
   * @returns 
   */
  private async decodeData (data, label, ip) {
    // 1. 获取label对应的密钥对
    const crypto = await this.cryptoModel.findOne({ where: { label }, raw: true })
    // 2. 判断该密钥对是否有效
    if (!crypto) {
      return parseResponse(500, '该加密公钥不存在！')
    }
    if (crypto.is_valid || crypto.generate_ip !== ip) {
      return parseResponse(500, '该公钥已失效，请重试！')
    }
    // 3. 对传输的内容进行解密(parseword: RSA-OAEP)
    const privateKey = pki.privateKeyFromPem(crypto.private_key)
    const password_dec = privateKey.decrypt(util.decode64(data), 'RSA-OAEP', { md: md.sha256.create() })
    return {
      data: password_dec
    }
  }
}
