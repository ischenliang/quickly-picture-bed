import { Controller, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleFilter, ChangeTheme, CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User as UserType } from 'src/user/entities/user.entity'
import { User } from 'src/common/user.decorator';

@Controller({
  path: 'article',
  version: '1'
})
@ApiTags('知识库文档管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  @HttpCode(200)
  @ApiOperation({ summary: '创建文档', description: '创建文档' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createArticleDto: CreateArticleDto, @User() user: UserType) {
    return this.articleService.create(createArticleDto, user.id);
  }

  @Post('page-tree')
  @HttpCode(200)
  @ApiOperation({ summary: '文档目录树', description: '文档目录树' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: ArticleFilter, @User() user: UserType) {
    return this.articleService.pageTree(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '文档详情', description: '查询文档详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '文档id'
        }
      }
    }
  })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.articleService.findOne(id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新文档', description: '更新文档' })
  @ApiResponse({ status: 200, description: '修改成功' })
  update(@Body() updateArticleDto: UpdateArticleDto, @User() user: UserType) {
    return this.articleService.update(updateArticleDto, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除文档', description: '删除文档' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '文档id'
        }
      }
    }
  })
  remove(@Body('id') id: number, @User() user: UserType) {
    return this.articleService.remove(id, user.id);
  }

  @Post('copy')
  @HttpCode(200)
  @ApiOperation({ summary: '复制文档', description: '复制文档' })
  @ApiResponse({ status: 200, description: '复制成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '文档id'
        }
      }
    }
  })
  copy (@Body('id') id: number, @User() user: UserType) {
    return this.articleService.copy(id, user.id);
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
          description: '拖拽文章id'
        },
        to: {
          type: 'number',
          description: '存放文章id'
        }
      }
    }
  })
  sort (@Body('from') from: number, @Body('to') to: number, @User() user: UserType) {
    return this.articleService.sort(from, to, user.id);
  }

  @Post('publish')
  @HttpCode(200)
  @ApiOperation({ summary: '发布文章', description: '发布文章' })
  @ApiResponse({ status: 200, description: '发布成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '文章id'
        }
      }
    }
  })
  publish (@Body('id') id: number, @User() user: UserType) {
    return this.articleService.publish(id, user.id);
  }

  @Post('theme')
  @HttpCode(200)
  @ApiOperation({ summary: '切换主题', description: '切换主题(包括代码、markdown主题)' })
  @ApiResponse({ status: 200, description: '发布成功' })
  theme (@Body() param: ChangeTheme, @User() user: UserType) {
    return this.articleService.theme(param, user.id);
  }
}
