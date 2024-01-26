import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from 'src/image/entities/image.entity';
import { Bucket } from 'src/bucket/entities/bucket.entity';
import { Plugin } from 'src/plugin/entities/plugin.entity';
import { Album } from 'src/album/entities/album.entity';
import { Wiki } from 'src/wiki/entities/wiki.entity';
import { Article } from 'src/article/entities/article.entity';
import { UserPlugin } from 'src/plugin/entities/user-plugin.entity';
import { Log } from 'src/log/entities/log.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Image, Bucket, Plugin, Album, Wiki, Article, UserPlugin, Log, User])
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
