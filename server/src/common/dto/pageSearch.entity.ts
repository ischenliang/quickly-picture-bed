import { ApiProperty } from "@nestjs/swagger";

export class PageSearch {
  @ApiProperty({ description: '页码', default: 1 })
  page: number

  @ApiProperty({ description: '页条数', default: 10 })
  size: number

  @ApiProperty({ description: '搜索', default: '' })
  search: string
}