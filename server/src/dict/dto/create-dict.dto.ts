import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateDictDto {
  @ApiProperty({ description: '字典名称', example: '用户角色' })
  name: string

  @ApiProperty({ description: '字典编码(唯一)', example: 'role' })
  code: string

  @ApiProperty({ description: '字典内容', example: [{ label: '管理员', value: 'admin' }] })
  values: Array<{
    label: string
    value: string
  }>
}


export class DictFilter extends PageSearch {
  // @ApiProperty({ description: '插件类别', default: 'uploader' })
  // category: string
}