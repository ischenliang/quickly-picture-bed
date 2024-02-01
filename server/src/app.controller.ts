import { Body, Controller, Get, HttpCode, Post, Req, Request, Res, UseGuards, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { RoleGuard } from './common/role.guard';
import { ToolService } from './tool/tool.service';
import { UserService } from './user/user.service';
import { Ip } from './common/ip.decorator';
import { LogService } from './log/log.service';
import { LogType } from './log/dto/create-log.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SmsCode } from './common/entities/smsCode.entity';
import { TimeService } from './common/time.service';
import { User } from './user/entities/user.entity';
import { SettingService } from './setting/setting.service';

class RegisterParam {
  @ApiProperty({ description: '邮箱账号' })
  account: string

  @ApiProperty({ description: '邮箱验证码' })
  sms_code: string

  @ApiProperty({ description: '账号密码' })
  password: string
}

@Controller({ path: '/'})
@ApiTags('根容器')
@UseGuards(RoleGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly toolService: ToolService,
    private readonly userService: UserService,
    private readonly logService: LogService,
    private readonly timeService: TimeService,
    private readonly settingService: SettingService,
    @InjectModel(SmsCode) private smsCodeModel: typeof SmsCode,
    @InjectModel(User) private userModel: typeof User
  ) {}

  @Get()
  @HttpCode(200)
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @Version('1')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          default: 'itchenliang@163.com'
        },
        password: {
          type: 'string',
          default: '000000'
        },
        verify_id: {
          type: 'number',
          default: 1
        },
        verify_code: {
          type: 'string',
          default: ''
        },
        type: {
          type: 'string',
          enum: ['password', 'verify_code']
        },
        sms_code: {
          type: 'string'
        }
      }
    }
  })
  @HttpCode(200)
  @ApiOperation({ summary: '登录', description: '登录' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async login (@Body() param: any, @Ip() ip: string) {
    const { email, password, verify_id, verify_code, type, sms_code } = param
    const existUser = await this.userService.findOneByEmail(email)
    switch (type) {
      case 'verify_code':
        const smscode = await this.toolService.smscodeCheck(email, sms_code)
        if (smscode.statusCode === 200) {
          if (existUser) {
            if (!existUser.status) {
              return { statusCode: 500, data: '账号已被禁用' }
            }
            const token = await this.authService.login(existUser)
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
      case 'password':
      default: 
        const captchaData = await this.authService.validateCaptcha(verify_id, verify_code)
        if (captchaData.statusCode === 200) {
          if (existUser) {
            const user = await this.authService.validateUser(email, password)
            if (user) {
              if (!user.status) {
                return { statusCode: 500, data: '账号已被禁用' }
              }
              const token = await this.authService.login(user)
              await this.logService.create({
                type: LogType.Login,
                operate_id: user.id,
                operate_cont: `登录成功[${user.email}]`
              }, ip, user.id)
              return {
                token: token.access_token,
                data: user
              }
            }
            return {
              statusCode: 500,
              data: '账号和密码不正确'
            }
          }
          return {
            statusCode: 500,
            data: '账号不存在'
          }
        }
        return captchaData
    }
  }

  @Post('register')
  @Version('1')
  @HttpCode(200)
  @ApiOperation({ summary: '注册', description: '注册账号' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async register (@Body() param: RegisterParam) {
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
    if (smsCode && smsCode.code !== param.sms_code) {
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
    const data = await this.userService.create({
      email: param.account,
      password: param.password,
      role: 1,
      username: param.account,
      avatar: '星座_白羊座'
    })
    return data
  }
}
