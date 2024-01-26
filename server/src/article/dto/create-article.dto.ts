import { ApiProperty, PickType } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题' })
  title: string

  @ApiProperty({ description: '文章类型', example: 'file', enum: ['file', 'folder', 'mind'] })
  type: string

  @ApiProperty({ description: '父级节点id' })
  pid: number

  @ApiProperty({ description: '文档id' })
  wid: number

  @ApiProperty({ description: '文档内容' })
  markdown: string
}

export class ArticleFilter extends PickType (PageSearch, [] as const) {
  @ApiProperty({ description: '知识库id' })
  wid: number
}

export class ChangeTheme {
  @ApiProperty({ description: '文章id' })
  id: number

  @ApiProperty({
    description: '文章主题',
    example: {
      code: 'github',
      markdown: 'github'
    }
  })
  theme: {
    code: string
    markdown: string
  }
}
