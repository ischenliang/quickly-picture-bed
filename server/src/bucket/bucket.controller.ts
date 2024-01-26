import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketFilter, CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User as UserType } from 'src/user/entities/user.entity'
import { User } from 'src/common/user.decorator';
import { Ip } from 'src/common/ip.decorator';

@Controller({
  path: 'bucket',
  version: '1'
})
@ApiTags('存储桶管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post('create')
  @HttpCode(200)
  @ApiOperation({ summary: '创建存储桶', description: '创建存储桶' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createBucketDto: CreateBucketDto, @Ip() ip: string, @User() user: UserType) {
    return this.bucketService.create(createBucketDto, ip, user.id);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '存储桶列表', description: '查询存储桶列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: BucketFilter, @User() user: UserType) {
    return this.bucketService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '存储桶详情', description: '查询存储桶详情' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '存储桶id'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.bucketService.findOne(id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新存储桶', description: '更新存储桶' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() updateBucketDto: UpdateBucketDto, @Ip() ip: string, @User() user: UserType) {
    return this.bucketService.update(updateBucketDto, ip, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除存储桶', description: '删除存储桶' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '存储桶id',
          default: 1
        }
      }
    }
  })
  remove(@Body('id') id: number, @Ip() ip: string, @User() user: UserType) {
    return this.bucketService.remove(id, ip, user.id);
  }

  @Post('toggle')
  @HttpCode(200)
  @ApiOperation({ summary: '切换存储桶状态', description: '切换存储桶状态' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '存储桶id',
          default: 1
        }
      }
    }
  })
  toggle (@Body('id') id: number, @User() user: UserType) {
    return this.bucketService.toggle(id, user.id);
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
          description: '拖拽存储桶id'
        },
        to: {
          type: 'number',
          description: '存放存储桶id'
        }
      }
    }
  })
  sort(@Body('from') from: number, @Body('to') to: number, @User() user: UserType) {
    return this.bucketService.sort(from, to, user.id);
  }
}
