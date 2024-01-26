import { ApiProperty } from "@nestjs/swagger";

export class CreateToolDto {}


export class UploadDto {
  @ApiProperty({ description: '文件上传路径', example: '/demo' })
  path: string
  @ApiProperty({ description: '文件' })
  file: string
}