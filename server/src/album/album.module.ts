import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Album } from './entities/album.entity';
import { AlbumTag } from 'src/album-tags/entities/album-tag.entity';
import { Image } from 'src/image/entities/image.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Album, AlbumTag, Image]),
    LogModule
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService]
})
export class AlbumModule {}
