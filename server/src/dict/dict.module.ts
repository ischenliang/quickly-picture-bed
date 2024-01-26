import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dict } from './entities/dict.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Dict])
  ],
  controllers: [DictController],
  providers: [DictService]
})
export class DictModule {}
