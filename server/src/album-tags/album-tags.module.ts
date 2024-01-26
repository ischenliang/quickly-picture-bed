import { Module } from '@nestjs/common';
import { AlbumTagsService } from './album-tags.service';
import { AlbumTagsController } from './album-tags.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumTag } from './entities/album-tag.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([AlbumTag])
  ],
  controllers: [AlbumTagsController],
  providers: [AlbumTagsService]
})
export class AlbumTagsModule {}
