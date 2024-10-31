import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { VerifyCode } from 'src/common/entities/verifyCode.entity';
import { SmsCode } from 'src/common/entities/smsCode.entity';
import { HttpModule } from '@nestjs/axios'
import { Dict } from 'src/dict/entities/dict.entity';
import { DictModule } from 'src/dict/dict.module';

@Module({
  imports: [
    // MulterModule.register({
    //   dest: join(__dirname, '../images')
    // })
    SequelizeModule.forFeature([VerifyCode, SmsCode, Dict]),
    HttpModule,
    DictModule
  ],
  controllers: [ToolController],
  providers: [ToolService],
  exports: [ToolService]
})
export class ToolModule {}
