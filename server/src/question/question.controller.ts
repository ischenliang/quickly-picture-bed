import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, QuestionFilter } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity';

@Controller({ path: 'question', version: '1' })
@ApiTags('知乎问题管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create')
  @HttpCode(200)
  @ApiOperation({ summary: '创建问题', description: '创建问题' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createQuestionDto: CreateQuestionDto, @User() user: UserType) {
    return this.questionService.create(createQuestionDto, user.id);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '问题列表', description: '查询问题列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: QuestionFilter, @User() user: UserType) {
    return this.questionService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '问题详情', description: '查询问题详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '问题id',
        },
      },
    },
  })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.questionService.findOne(id, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除问题', description: '删除问题' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '问题id',
        },
      },
    },
  })
  remove(@Body('id') id: number, @User() user: UserType) {
    return this.questionService.remove(id, user.id);
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
          description: '问题id',
        },
      },
    },
  })
  toggleSchedule(@Body('id') id: number, @User() user: UserType) {
    return this.questionService.toggleSchedule(id, user.id);
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
          description: '问题id',
        },
        direction: {
          type: 'string',
          default: 'up',
          description: '移动方向 up-上移 down-下移',
        },
      },
    },
  })
  sort(
    @Body('id') id: number,
    @Body('direction') direction: 'up' | 'down',
    @User() user: UserType,
  ) {
    return this.questionService.sort(id, direction, user.id);
  }
}
