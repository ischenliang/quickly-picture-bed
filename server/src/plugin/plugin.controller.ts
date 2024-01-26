import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { CreatePluginDto, PluginFilter } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { Role } from 'src/common/role.descorator';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity'
import { Ip } from 'src/common/ip.decorator';

@Controller({
  path: 'plugin',
  version: '1'
})
@ApiTags('插件管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Post('create')
  @HttpCode(200)
  @Role(['admin'])
  @ApiOperation({ summary: '创建插件', description: '创建插件只能管理员操作' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createPluginDto: CreatePluginDto) {
    return this.pluginService.create(createPluginDto);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '插件列表', description: '查询插件列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: PluginFilter, @User() user: UserType) {
    // Todo: 这里还需要将用户安装列表返回
    return this.pluginService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '插件详情', description: '查询插件详情' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '插件id'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.pluginService.findOne(id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @Role(['admin'])
  @ApiOperation({ summary: '更新插件', description: '更新插件，管理员操作' })
  @ApiResponse({ status: 200, description: '查询成功' })
  update(@Body() updatePluginDto: UpdatePluginDto) {
    return this.pluginService.update(updatePluginDto);
  }

  @Post('delete')
  @HttpCode(200)
  @Role(['admin'])
  @ApiOperation({ summary: '删除插件', description: '删除插件，管理员操作' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '插件id',
          default: 1
        }
      }
    }
  })
  remove(@Body('id') id: number) {
    return this.pluginService.remove(id);
  }

  @Post('install')
  @HttpCode(200)
  @ApiOperation({ summary: '安装插件', description: '安装插件' })
  @ApiResponse({ status: 200, description: '安装成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '插件id',
          default: 1
        },
        secret_key: {
          type: 'string',
          description: '插件安装秘钥(针对付费版本插件)',
          default: ''
        }
      }
    }
  })
  install(@Body('id') id: number, @Ip() ip: string, @Body('secret_key') secret_key: string, @User() user: UserType) {
    return this.pluginService.install(id, ip, secret_key, user.id);
  }

  @Post('uninstall')
  @HttpCode(200)
  @ApiOperation({ summary: '卸载插件', description: '卸载插件' })
  @ApiResponse({ status: 200, description: '卸载成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '插件id',
          default: 1
        }
      }
    }
  })
  uninstall(@Body('id') id: number, @Ip() ip: string, @User() user: UserType) {
    return this.pluginService.uninstall(id, ip, user.id);
  }

  @Post('updateInstall')
  @HttpCode(200)
  @ApiOperation({ summary: '更新安装插件', description: '更新安装插件' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '插件id',
          default: 1
        }
      }
    }
  })
  updateInstall(@Body('id') id: number, @Ip() ip: string, @User() user: UserType) {
    return this.pluginService.updateIntsall(id, ip, user.id);
  }

  @Post('installed')
  @HttpCode(200)
  @ApiOperation({ summary: '已安装列表', description: '获取当前登录用户的已安装插件列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          description: '插件状态',
          default: true
        },
        type: {
          type: 'string',
          description: '插件类型',
          default: '',
          enum: ['uploader', 'themer', 'transformer', 'handler', 'commander', 'tooler']
        }
      }
    }
  })
  installed (@Body('status') status: boolean, @Body('type') type: string, @User() user: UserType) {
    return this.pluginService.getUserPlugins(status, type, user.id);
  }

  @Post('toggleIntsall')
  @HttpCode(200)
  @ApiOperation({ summary: '切换已安装插件状态', description: '启用或停用已安装插件' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_plugin_id: {
          type: 'number',
          description: '插件安装记录id',
          default: 1
        }
      }
    }
  })
  toggleIntsall (@Body('user_plugin_id') user_plugin_id: number, @User() user: UserType) {
    return this.pluginService.toggleIntsall(user_plugin_id, user.id)
  }

  @Post('toggle')
  @HttpCode(200)
  @ApiOperation({ summary: '切换插件状态', description: '启用或停用插件' })
  @ApiResponse({ status: 200, description: '切换成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '插件id',
          default: 1
        }
      }
    }
  })
  toggle (@Body('id') id: number, @User() user: UserType) {
    return this.pluginService.toggle(id, user.id)
  }

  @Post('sort')
  @HttpCode(200)
  @ApiOperation({ summary: '拖拽排序', description: '拖拽排序' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        from: {
          type: 'number',
          description: '拖拽目标id'
        },
        to: {
          type: 'number',
          description: '存放目标id'
        }
      }
    }
  })
  sort(@Body('from') from: number, @Body('to') to: number, @User() user: UserType) {
    return this.pluginService.sort(from, to, user.id);
  }
}
