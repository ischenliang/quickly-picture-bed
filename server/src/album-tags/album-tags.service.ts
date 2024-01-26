import { Injectable } from '@nestjs/common';
import { CreateAlbumTagDto } from './dto/create-album-tag.dto';
import { UpdateAlbumTagDto } from './dto/update-album-tag.dto';
import { InjectModel } from '@nestjs/sequelize';
import { AlbumTag } from './entities/album-tag.entity';

@Injectable()
export class AlbumTagsService {

  constructor (@InjectModel(AlbumTag) private albumTagModel: typeof AlbumTag) {}

  /**
   * 创建相册标签
   * @param createAlbumTagDto 
   * @returns 
   */
  create(createAlbumTagDto: CreateAlbumTagDto) {
    return this.albumTagModel.create(createAlbumTagDto);
  }

  /**
   * 标签详情
   * @param album_id 
   * @returns 
   */
  findOne(album_id: number) {
    return this.albumTagModel.findOne({
      where: {
        album_id
      }
    });
  }

  /**
   * 更新标签
   * @param updateAlbumTagDto 
   * @returns 
   */
  update(updateAlbumTagDto: UpdateAlbumTagDto) {
    return this.albumTagModel.update(updateAlbumTagDto, {
      where: {
        album_id: updateAlbumTagDto.album_id
      }
    });
  }
}
