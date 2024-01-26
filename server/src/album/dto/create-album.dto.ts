import { ApiProperty } from "@nestjs/swagger";
import { Album } from "../entities/album.entity";
import { PageSearch } from "src/common/dto/pageSearch.entity";

export class CreateAlbumDto {
  @ApiProperty({ description: '相册名称', example: '风景图片' })
  name: string
  
  @ApiProperty({ description: '相册描述', example: '相册描述....', required: false })
  desc: string
  
  @ApiProperty({ description: '访问权限', required: true, enum: [0, 1, 2], default: 0 })
  access_type: number
  
  @ApiProperty({ description: '访问密码', required: false, default: '' })
  access_pass: string
  
  @ApiProperty({ description: '相册背景', required: false, default: '#009688' })
  background: string
}


export class AlbumFilter extends PageSearch {
  // @ApiProperty({ description: '排序字段', default: '' })
  // sort: string

  @ApiProperty({ description: '相册类型', default: '', enum: ['', 0, 1, 2] })
  access_type: string | number
}

export class AlbumImagesFilter extends AlbumFilter {
  @ApiProperty({ description: '相册id' })
  id: number
}