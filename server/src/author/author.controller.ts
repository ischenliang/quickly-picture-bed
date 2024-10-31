import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorFilter, AuthorQuestionFilter, CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity'
import { CreateReceiverDto, NotifyFilter, ReceiverFilter } from './dto/create-receiver.dto';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller({ path: 'author', version: '1' })
@ApiTags('知乎作者管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  
  @Post('create')
  @HttpCode(200)
  @ApiOperation({ summary: '新增作者', description: '新增作者' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createAuthorDto: CreateAuthorDto, @User() user: UserType) {
    return this.authorService.create(createAuthorDto, user.id);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '作者列表', description: '查询作者列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: AuthorFilter, @User() user: UserType) {
    return this.authorService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '作者详情', description: '查询作者详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '作者id'
        }
      }
    }
  })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.findOne(id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新作者', description: '更新作者' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() param: CreateAuthorDto, @User() user: UserType) {
    return this.authorService.update(param, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除作者', description: '删除作者' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '作者id'
        }
      }
    }
  })
  remove(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.remove(id, user.id);
  }

  @Post('toggleSchedule')
  @HttpCode(200)
  @ApiOperation({ summary: '切换定时任务', description: '切换定时任务' })
  @ApiResponse({ status: 200, description: '切换成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '作者id'
        }
      }
    }
  })
  toggleSchedule(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.toggleSchedule(id, user.id)
  }

  @Post('sort')
  @HttpCode(200)
  @ApiOperation({ summary: '调整排序', description: '调整排序' })
  @ApiResponse({ status: 200, description: '排序成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '问题id'
        },
        direction: {
          type: 'string',
          default: 'up',
          description: '移动方向 up-上移 down-下移'
        },
        author_type: {
          type: 'string',
          default: 'publisher',
          description: '作者类型 publisher-题主 answer-答主'
        }
      }
    }
  })
  sort(@Body('id') id: number, @Body('direction') direction: 'up' | 'down', @Body('author_type') author_type: 'publisher' | 'answer', @User() user: UserType) {
    return this.authorService.sort(id, direction, author_type, user.id);
  }

  @Post('stats')
  @HttpCode(200)
  @ApiOperation({ summary: '统计数据', description: '统计数据' })
  @ApiResponse({ status: 200, description: '查询成功' })
  stats(@User() user: UserType) {
    return this.authorService.getStats(user.id);
  }

  @Post('question/list')
  @HttpCode(200)
  @ApiOperation({ summary: '问题列表', description: '问题列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  questions(@Body() param: AuthorQuestionFilter, @User() user: UserType) {
    return this.authorService.findAllQuestion(param, user.id);
  }

  @Post('question/create')
  @HttpCode(200)
  @ApiOperation({ summary: '新增问题', description: '新增问题' })
  @ApiResponse({ status: 200, description: '新增成功' })
  createQuestion(@Body() param: CreateQuestionDto, @User() user: UserType) {
    return this.authorService.createQuestionByHand(param, user.id);
  }

  @Post('question/delete')
  @HttpCode(200)
  @ApiOperation({ summary: '新增问题', description: '新增问题' })
  @ApiResponse({ status: 200, description: '新增成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '问题id'
        }
      }
    }
  })
  deleteQuestion(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.removeQuestion(id, user.id);
  }

  @Post('question/update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新问题', description: '更新问题' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '问题id'
        }
      }
    }
  })
  updateQuestion(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.updateQuestion(id, user.id);
  }

  @Post('question/mark')
  @HttpCode(200)
  @ApiOperation({ summary: '标记问题', description: '标记问题' })
  @ApiResponse({ status: 200, description: '标记成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '问题id'
        }
      }
    }
  })
  markQuestion(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.markQuestion(id, user.id);
  }

  @Post('receiver/list')
  @HttpCode(200)
  @ApiOperation({ summary: '接收者列表', description: '查询通知接收者列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  receivers(@Body() param: ReceiverFilter, @User() user: UserType) {
    return this.authorService.findAllReceiver(param, user.id);
  }

  @Post('receiver/create')
  @HttpCode(200)
  @ApiOperation({ summary: '新增接收者', description: '创建新的接收者' })
  @ApiResponse({ status: 200, description: '创建成功' })
  createReceiver(@Body() param: CreateReceiverDto, @User() user: UserType) {
    return this.authorService.createReceiver(param, user.id);
  }

  @Post('receiver/update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新接收者', description: '更新接收者信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  updateReceiver(@Body() param: CreateReceiverDto, @User() user: UserType) {
    return this.authorService.updateReceiver(param, user.id);
  }

  @Post('receiver/delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除接收者', description: '删除接收者' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '接收者id'
        }
      }
    }
  })
  deleteReceiver(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.removeReceiver(id, user.id);
  }
  
  @Post('notify/list')
  @HttpCode(200)
  @ApiOperation({ summary: '通知列表', description: '查询通知列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  notifies(@Body() param: NotifyFilter, @User() user: UserType) {
    return this.authorService.findAllNotify(param, user.id);
  }
  
  @Post('notify/delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除通知', description: '删除通知' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '通知记录id'
        }
      }
    }
  })
  deleteNotify(@Body('id') id: number, @User() user: UserType) {
    return this.authorService.removeNotify(id, user.id);
  }

  @Post('notify/cookie')
  @HttpCode(200)
  @ApiOperation({ summary: '更新cookie', description: '更新cookie' })
  @ApiResponse({ status: 200, description: '更新成功' })
  updateCookie() {
    return this.authorService.updateCookie();
  }
}
