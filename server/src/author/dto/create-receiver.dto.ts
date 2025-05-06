import { ApiProperty } from "@nestjs/swagger";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateReceiverDto {
  @ApiProperty({ description: 'id' })
  id?: number

  @ApiProperty({ description: '邮箱地址' })
  email?: string

  @ApiProperty({ description: '备注' })
  remark?: string

  @ApiProperty({ description: '状态' })
  status?: number
}

export class ReceiverFilter extends PageSearch {
  @ApiProperty({ description: '状态' })
  status: number
}