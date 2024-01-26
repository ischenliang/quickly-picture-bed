import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wiki } from './entities/wiki.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Wiki, Article])
  ],
  controllers: [WikiController],
  providers: [WikiService],
  exports: [WikiService]
})
export class WikiModule {}
