import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAlbumDto } from './create-album.dto';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @ApiProperty({ description: '相册id', default: 1 })
  id: number
  
  @ApiProperty({ description: '相册封面', required: false })
  cover: string
}
