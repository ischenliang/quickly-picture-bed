import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateBucketDto {
  @ApiProperty({ description: '存储桶名称' })
  name: string

  @ApiProperty({ description: '存储桶配置', example: { token: '' } })
  config: object

  @ApiProperty({ description: '用户安装插件id' })
  user_plugin_id: number
}

export class BucketFilter extends PageSearch {
  @ApiProperty({ description: '存储桶状态' })
  visible: boolean

  @ApiProperty({ description: '是否只获取id和名称', default: false })
  is_only_names: boolean
}