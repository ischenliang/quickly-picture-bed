import { Body, Controller, Get, HttpCode, Post, UseGuards, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from './common/role.guard';
import { Ip } from './common/ip.decorator';

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
  constructor(private readonly appService: AppService) {}

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
    return this.appService.login(param, ip)
  }

  @Post('register')
  @Version('1')
  @HttpCode(200)
  @ApiOperation({ summary: '注册', description: '注册账号' })
  @ApiResponse({ status: 200, description: '操作成功' })
  async register (@Body() param: RegisterParam, @Ip() ip: string) {
    return this.appService.register(param, ip)
  }

  @Post('pke')
  @Version('1')
  @HttpCode(200)
  @ApiOperation({ summary: '获取公钥', description: '获取密钥对的公钥' })
  @ApiResponse({ status: 200, description: '操作成功' })
  pke (@Ip() ip: string) {
    return this.appService.generateCryptoKey(ip)
  }
}
