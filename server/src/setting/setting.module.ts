import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Setting])
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService]
})
export class SettingModule {}
