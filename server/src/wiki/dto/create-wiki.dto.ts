import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateWikiDto {
  @ApiProperty({ description: '知识库名称' })
  title: string

  @ApiProperty({ description: '知识库描述' })
  description: string

  // @ApiProperty({ description: '文档权重，值越大越靠前' })
  // weight: number

  @ApiProperty({ description: '文档状态', example: false })
  status: boolean

  @ApiProperty({
    description: '空间配置', 
    example: {
      type: 'gitee',
      owner: '',
      repo: '',
      branch: 'master',
      access_token: '',
      baseurl: ''
    }
  })
  config: {
    type: 'gitee' | 'github'
    owner: string
    repo: string
    branch: string
    access_token: string
    baseurl: string
  }
}


export class WikiFilter extends PageSearch {
  @ApiProperty({ description: '状态' })
  status: boolean
}