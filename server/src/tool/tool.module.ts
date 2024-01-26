import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { VerifyCode } from 'src/common/entities/verifyCode.entity';
import { SmsCode } from 'src/common/entities/smsCode.entity';
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    // MulterModule.register({
    //   dest: join(__dirname, '../images')
    // })
    SequelizeModule.forFeature([VerifyCode, SmsCode]),
    HttpModule
  ],
  controllers: [ToolController],
  providers: [ToolService],
  exports: [ToolService]
})
export class ToolModule {}
