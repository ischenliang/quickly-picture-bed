import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSettingDto } from './create-setting.dto';

export class UpdateSettingDto extends CreateSettingDto {
  @ApiProperty({ description: '配置id' })
  id: number
}
