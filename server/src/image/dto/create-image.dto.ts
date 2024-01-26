import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateImageDto {}

export class ImageIdDto {
  @ApiProperty({ description: '图片id' })
  id: number
}

export class ImageFilter extends PageSearch {
  @ApiProperty({ description: '存储桶id' })
  bucket_id: number

  @ApiProperty({ description: '相册id' })
  album_id: number
}