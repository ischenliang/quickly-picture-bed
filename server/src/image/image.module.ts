import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './entities/image.entity';
import { HttpModule } from '@nestjs/axios';
import { Bucket } from 'src/bucket/entities/bucket.entity';
import { Album } from 'src/album/entities/album.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Image, Bucket, Album]),
    HttpModule,
    LogModule
  ],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImageModule {}
