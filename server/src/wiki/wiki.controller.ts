import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { CreateWikiDto, WikiFilter } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity'

@Controller({ path: 'wiki', version: '1' })
@ApiTags('知识库管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Post('create')
  @HttpCode(200)
  @ApiOperation({ summary: '创建知识库', description: '创建知识库' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createWikiDto: CreateWikiDto, @User() user: UserType) {
    return this.wikiService.create(createWikiDto, user.id);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '知识库列表', description: '查询知识库列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: WikiFilter, @User() user: UserType) {
    return this.wikiService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '知识库详情', description: '查询知识库详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '知识库id'
        }
      }
    }
  })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.wikiService.findOne(id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新知识库', description: '更新知识库，创建后git地址不可修改' })
  @ApiResponse({ status: 200, description: '修改成功' })
  update(@Body() updateWikiDto: UpdateWikiDto, @User() user: UserType) {
    return this.wikiService.update(updateWikiDto, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除知识库', description: '删除知识库' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '知识库id'
        }
      }
    }
  })
  remove(@Body('id') id: number, @User() user: UserType) {
    return this.wikiService.remove(id, user.id);
  }

  @Post('sort')
  @HttpCode(200)
  @ApiOperation({ summary: '拖拽排序', description: '拖拽排序' })
  @ApiResponse({ status: 200, description: '排序成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        from: {
          type: 'number',
          description: '拖拽文档id'
        },
        to: {
          type: 'number',
          description: '存放文档id'
        }
      }
    }
  })
  sort (@Body('from') from: number, @Body('to') to: number, @User() user: UserType) {
    return this.wikiService.sort(from, to, user.id);
  }

  @Post('copy')
  @HttpCode(200)
  @ApiOperation({ summary: '复制知识库', description: '复制知识库，只复制知识库，不会复制文章' })
  @ApiResponse({ status: 200, description: '复制成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '知识库id'
        },
        name: {
          type: 'string',
          default: '',
          description: '知识库名称'
        }
      }
    }
  })
  copy(@Body('id') id: number, @Body('name') name: string, @User() user: UserType) {
    return this.wikiService.copy(id, name, user.id);
  }
}
