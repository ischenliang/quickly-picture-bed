import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './entities/question.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ToolModule } from 'src/tool/tool.module';
import { NotifyHistory } from 'src/author/entities/notifyHistory';
import { NotifyReceiver } from 'src/author/entities/notifyReceiver.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Question, NotifyHistory, NotifyReceiver]),
    ScheduleModule.forRoot(),
    ToolModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
