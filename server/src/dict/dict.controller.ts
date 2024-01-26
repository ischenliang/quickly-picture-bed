import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateDictDto, DictFilter } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Role } from 'src/common/role.descorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';

@Controller({
  path: 'dict',
  version: '1'
})
@ApiTags('字典管理')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post('create')
  @Role(['admin'])
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: '创建字典', description: '关键字典管理员操作' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createDictDto: CreateDictDto) {
    return this.dictService.create(createDictDto);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '字典列表', description: '查询字典列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: DictFilter) {
    return this.dictService.findAll(param);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: '字典详情', description: '查询字典详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '字典id',
          default: 1
        }
      }
    }
  })
  findOne(@Body('id') id: number) {
    return this.dictService.findOne(id);
  }

  @Post('update')
  @Role(['admin'])
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: '更新字典', description: '更新字典' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() updateDictDto: UpdateDictDto) {
    return this.dictService.update(updateDictDto);
  }

  @Post('delete')
  @Role(['admin'])
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: '删除字典', description: '删除字典' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '字典id',
          default: 1
        }
      }
    }
  })
  remove(@Body('id') id: number) {
    return this.dictService.remove(id);
  }

  @Post('findByPro')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: '按属性查询字典', description: '按属性以及对应值查询字典' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        property: {
          type: 'string',
          description: '属性key'
        },
        value: {
          type: 'string',
          description: '属性value'
        }
      }
    }
  })
  findByPro(@Body() param: { property: string, value: string }) {
    return this.dictService.findByPro(param);
  }
}
