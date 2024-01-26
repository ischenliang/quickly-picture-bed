import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateBucketDto } from './create-bucket.dto';

export class UpdateBucketDto extends PickType(CreateBucketDto, ['name', 'config']) {
  @ApiProperty({ description: '存储桶id' })
  id: number
}
