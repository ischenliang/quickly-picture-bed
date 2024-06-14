import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateAuthorDto {
  @ApiProperty({ description: 'id' })
  id?: number

  @ApiProperty({ description: '作者id' })
  author_id: string

  @ApiProperty({ description: '账号类型' })
  author_type: 'answer' | 'publisher'

  @ApiProperty({ description: '是否为机构账号' })
  is_org: boolean
}

export class AuthorFilter extends PageSearch {
  @ApiProperty({ description: '账号类型' })
  author_type: 'answer' | 'publisher'

  @ApiProperty({ description: '是否机构账号' })
  is_org: boolean
}

export class AuthorQuestionFilter extends PageSearch {
  @ApiProperty({ description: '类型' })
  type: 'publish' | 'answer' | 'follow'

  @ApiProperty({ description: '问题类型' })
  question_type: 'commercial' | 'normal'

  @ApiProperty({ description: '作者表id' })
  author_id: number
}


export class CreateAuthorQuestionDto {
  @ApiProperty({ description: 'id' })
  id?: number

  @ApiProperty({ description: '问题id' })
  question_id: string

  @ApiProperty({ description: '问题标题' })
  question_title: string

  @ApiProperty({ description: '问题描述' })
  question_desc: string

  @ApiProperty({ description: '问题类型' })
  question_type: string

  @ApiProperty({ description: '类型' })
  type: 'publish' | 'answer' | 'follow'

  @ApiProperty({ description: '问题创建时间' })
  question_created: string

  @ApiProperty({ description: '问题更新时间' })
  question_updated: string
}