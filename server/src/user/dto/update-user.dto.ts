import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitDto, CreateUserDto } from './create-user.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PickType(CreateUserDto, ['avatar', 'config', 'role', 'status', 'username']) {
  @ApiProperty({ description: '用户id' })
  id: number

  @ApiProperty({ description: '性别' })
  gender: string
}


export class UpdateHabitDto extends CreateHabitDto {
  @ApiProperty({ description: '习惯id' })
  id: number

  // @ApiProperty({ description: '用户id' })
  // uid: number
}