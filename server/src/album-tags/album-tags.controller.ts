import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { AlbumTagsService } from './album-tags.service';
import { UpdateAlbumTagDto } from './dto/update-album-tag.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';

@Controller({
  path: 'album-tags',
  version: '1'
})
@ApiTags('相册标签')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AlbumTagsController {
  constructor(private readonly albumTagsService: AlbumTagsService) {}

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '查询相册标签', description: '相册标签' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        album_id: {
          type: 'number',
          description: '相册id'
        }
      }
    }
  })
  findOne(@Body('album_id') album_id: number) {
    return this.albumTagsService.findOne(album_id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新相册标签', description: '更新相册标签' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() updateAlbumTagDto: UpdateAlbumTagDto) {
    return this.albumTagsService.update(updateAlbumTagDto);
  }
}
