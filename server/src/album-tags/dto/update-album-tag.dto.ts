import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAlbumTagDto } from './create-album-tag.dto';

export class UpdateAlbumTagDto extends PartialType(CreateAlbumTagDto) {
  // @ApiProperty({ description: '标签id' })
  // id: number
}
