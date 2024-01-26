import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto, LogFilter } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { Ip } from 'src/common/ip.decorator';
import { User as UserType } from 'src/user/entities/user.entity'
import { User } from 'src/common/user.decorator';
import { Role } from 'src/common/role.descorator';

@Controller({
  path: 'log',
  version: '1'
})
@ApiTags('日志管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post('all')
  @HttpCode(200)
  @Role(['admin'])
  @ApiOperation({ summary: '日志列表', description: '查询所有日志列表(只可管理员操作)' })
  @ApiResponse({ status: 200, description: '查询成功' })
  all(@Body() param: LogFilter, @User() user: UserType) {
    return this.logService.all(param, user.id);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '日志列表', description: '查询日志列表(只有自己的日志)' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: LogFilter, @User() user: UserType) {
    return this.logService.findAll(param, user.id);
  }

  @Post('contributes')
  @HttpCode(200)
  @ApiOperation({ summary: '贡献列表按天查询', description: '目前只统计图片操作' })
  @ApiResponse({ status: 200, description: '查询成功' })
  contributes(@User() user: UserType) {
    return this.logService.contributes(user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @Role(['admin'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '日志id'
        }
      }
    }
  })
  @ApiOperation({ summary: '删除日志', description: '只可管理员操作' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Body('id') id: number) {
    return this.logService.remove(id)
  }

  @Post('reLocate')
  @HttpCode(200)
  @Role(['admin'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '日志id'
        }
      }
    }
  })
  @ApiOperation({ summary: '重新定位', description: '只可管理员操作' })
  @ApiResponse({ status: 200, description: '操作成功' })
  reLocate(@Body('id') id: number, @Ip() ip: string) {
    return this.logService.reLocate(id, ip)
  }
}
