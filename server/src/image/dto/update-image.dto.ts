import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {
  @ApiProperty({ description: '图片id' })
  id: number

  @ApiProperty({ description: '图片名称' })
  name: string

  @ApiProperty({ description: '图片原名称' })
  origin_name: string

  @ApiProperty({ description: '图片配置', default: {}, required: false })
  config: object

  @ApiProperty({ description: '图片标签', default: [], required: false })
  tags: any[]

  @ApiProperty({ description: '图片标签', default: 1, required: false })
  album_id: number

  @ApiProperty({ description: '图片添加时间', required: false })
  add_time: string
}
