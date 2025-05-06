import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionDto {
  @ApiProperty({ description: '红包金额' })
  question_red_money?: number;

  @ApiProperty({ description: '红包数量' })
  question_red_count?: number;

  @ApiProperty({ description: '通知状态' })
  notify_status?: number;

  @ApiProperty({ description: '通知状态' })
  notify_time?: string;

  @ApiProperty({ description: '状态' })
  status?: number;
}
