import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller({
  path: 'tool',
  version: '1'
})
@ApiTags('工具')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post('upload')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '文件上传', description: '上传文件' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        },
        path: {
          type: 'string'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body('path') path: string) {
    return this.toolService.upload(file, path)
  }

  @Post('imgCreate')
  @HttpCode(200)
  @ApiOperation({
    summary: '生成图片验证码',
    description: '生成图形验证码，首次传入"-"'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        last_id: {
          type: 'string',
          description: '上次的验证id'
        }
      }
    }
  })
  async imgCreate(@Body('last_id') last_id: string) {
    return this.toolService.imgCreate(last_id)
  }

  @Post('imgCheck')
  @HttpCode(200)
  @ApiOperation({
    summary: '校验图形验证码',
    description: '校验图形验证码'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '图形验证码id'
        },
        anser: {
          type: 'string',
          description: '图形验证码结果'
        }
      }
    }
  })
  async imgCheck(@Body() param: { id: number, anser: string }) {
    return this.toolService.imgCheck(param)
  }

  @Post('smsSend')
  @HttpCode(200)
  @ApiOperation({
    summary: '短信验证码 | 邮箱验证码',
    description: '短信验证码 | 邮箱验证码'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        account: {
          type: 'string',
          description: '邮箱账号'
        },
        verify_code: {
          type: 'string',
          description: '图形验证码结果'
        },
        verify_id: {
          type: 'string',
          description: '图形验证码id'
        },
        type: {
          type: 'string',
          enum: ['email', 'phone'],
          description: '验证码类型'
        }
      }
    }
  })
  async smsSend(@Body() param: { account: string, verify_code: string, verify_id: string, type: 'email' | 'phone' }) {
    return this.toolService.smsSend(param)
  }

  @Post('npmRegistryPackage')
  @ApiOperation({ summary: 'npm插件package.json信息', description: 'npm插件package.json信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '插件名称'
        }
      }
    }
  })
  npmRegistryPackage (@Body('name') name: string) {
    return this.toolService.npmRegistryPackage(name)
  }
}
