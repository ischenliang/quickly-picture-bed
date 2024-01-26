import { ApiProperty } from "@nestjs/swagger";

export class CreateAlbumTagDto {
  @ApiProperty({ description: '相册id' })
  album_id: number

  @ApiProperty({
    description: '标签列表',
    example: [
      { type: 'primary', value: '标签1' }
    ]
  })
  tags: Array<{
    type: string
    value: string
  }>
}