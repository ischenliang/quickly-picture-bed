import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreatePluginDto {
  @ApiProperty({ description: '名称', example: '@itchenliang/picture-rollup-oss-plugin' })
  name: string

  @ApiProperty({ description: '描述', example: '插件描述...' })
  description: string

  @ApiProperty({ description: '版本号', example: '1.0.0' })
  version: string

  @ApiProperty({ description: '插件logo', example: 'xxxxx' })
  logo: string

  @ApiProperty({ description: '别名', example: '阿里云OSS' })
  title: string

  @ApiProperty({ description: '作者', example: 'it-chenliang' })
  author: string

  @ApiProperty({ description: '插件类别', example: 'uploader', examples: ['themer', 'uploader', 'transformer', 'handler', 'commander', 'tooler'] })
  category: string

  @ApiProperty({ description: '插件运行平台', example: 'Node', examples: ['Node', 'Browser'] })
  platform: string

  @ApiProperty({ description: '状态', example: false })
  status: boolean

  @ApiProperty({ description: '是否付费', example: false })
  payment: boolean

  @ApiProperty({ description: '付费版本', example: 'free' })
  payment_type: string

  @ApiProperty({ description: '价格', example: 0 })
  price: number
}

export class PluginFilter extends PageSearch {
  @ApiProperty({ description: '插件类别', default: 'uploader' })
  category: string

  @ApiProperty({ description: '插件类别', default: true })
  status: boolean
}
