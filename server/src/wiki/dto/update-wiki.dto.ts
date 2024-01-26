import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateWikiDto {
  @ApiProperty({ description: '知识库id' })
  id: number

  @ApiProperty({ description: '知识库名称' })
  title: string

  @ApiProperty({ description: '知识库描述' })
  description: string

  @ApiProperty({ description: '文档状态', example: false })
  status: boolean
}
