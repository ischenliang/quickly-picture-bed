import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDictDto } from './create-dict.dto';

export class UpdateDictDto extends PartialType(CreateDictDto) {
  @ApiProperty({ description: '字典id', example: 1 })
  id: number
}
