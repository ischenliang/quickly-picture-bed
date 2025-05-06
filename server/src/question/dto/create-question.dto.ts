import { ApiProperty } from '@nestjs/swagger';
import { PageSearch } from 'src/common/dto/pageSearch.entity';

export class CreateQuestionDto {
  @ApiProperty({ description: '问题id' })
  quesion_id: string;
}

export class QuestionFilter extends PageSearch {
  @ApiProperty({ description: '状态' })
  status: number;
}
