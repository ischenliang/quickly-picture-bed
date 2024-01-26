import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Article } from './entities/article.entity';
import { WikiModule } from 'src/wiki/wiki.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Article]),
    WikiModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class ArticleModule {}

