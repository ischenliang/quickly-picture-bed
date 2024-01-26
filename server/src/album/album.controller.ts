import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumFilter, AlbumImagesFilter, CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity';
import { Ip } from 'src/common/ip.decorator';

@Controller({
  path: 'album',
  version: '1'
})
@ApiTags('相册管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('create')
  @HttpCode(200)
  @ApiOperation({ summary: '创建相册', description: '创建相册' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createAlbumDto: CreateAlbumDto, @Ip() ip: string, @User() user: UserType) {
    return this.albumService.create(createAlbumDto, ip, user.id);
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '相册列表', description: '查询相册列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: AlbumFilter, @User() user) {
    return this.albumService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '相册详情', description: '查询相册详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '相册id'
        }
      }
    }
  })
  findOne(@Body('id') id: number, @User() user: UserType) {
    return this.albumService.findOne(id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新相册', description: '更新相册' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() updateAlbumDto: UpdateAlbumDto, @Ip() ip: string, @User() user: UserType) {
    return this.albumService.update(updateAlbumDto, ip, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除相册', description: '删除相册' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          default: 1,
          description: '相册id'
        }
      }
    }
  })
  remove(@Body('id') id: number, @Ip() ip: string, @User() user: UserType) {
    return this.albumService.remove(id, ip, user.id);
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
          description: '拖拽相册id'
        },
        to: {
          type: 'number',
          description: '存放相册id'
        }
      }
    }
  })
  sort(@Body('from') from: number, @Body('to') to: number, @User() user: UserType) {
    return this.albumService.sort(from, to, user.id);
  }

  @Post('images')
  @HttpCode(200)
  @ApiOperation({ summary: '相册图片', description: '查询该相册下的所有图片' })
  @ApiResponse({ status: 200, description: '查询成功' })
  images(@Body() param: AlbumImagesFilter, @User() user: UserType) {
    return this.albumService.images(param, user.id);
  }

  // 广场相册

  // 相册详情：不需要用户id，同时每次调用就更新一次浏览量
}
