import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePluginDto } from './create-plugin.dto';

export class UpdatePluginDto extends PartialType(CreatePluginDto) {
  @ApiProperty({ description: '插件id', example: 1 })
  id: number
}
