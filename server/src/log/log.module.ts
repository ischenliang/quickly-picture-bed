import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import { Setting } from 'src/setting/entities/setting.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Log, Setting, User])
  ],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService]
})
export class LogModule {}
