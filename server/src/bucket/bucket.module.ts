import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bucket } from './entities/bucket.entity';
import { LogModule } from 'src/log/log.module';
import { Image } from 'src/image/entities/image.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Bucket, Image]),
    LogModule
  ],
  controllers: [BucketController],
  providers: [BucketService],
  exports: [BucketService]
})
export class BucketModule {}
