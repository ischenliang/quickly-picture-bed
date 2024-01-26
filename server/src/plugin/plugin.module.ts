import { Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plugin } from './entities/plugin.entity';
import { UserPlugin } from './entities/user-plugin.entity';
import { BucketModule } from 'src/bucket/bucket.module';
import { LogModule } from 'src/log/log.module';
import { Habits } from 'src/user/entities/habits.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Plugin, UserPlugin, Habits]),
    BucketModule,
    LogModule
  ],
  controllers: [PluginController],
  providers: [PluginService]
})
export class PluginModule {}
