import { Controller, Post, Body, UseGuards, Query, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserFilter } from './dto/create-user.dto';
import { UpdateHabitDto, UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/common/role.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/role.descorator';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from './entities/user.entity'

const userIdSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      default: 1,
      description: '用户id'
    }
  }
}

@Controller({
  path: 'user',
  version: '1'
})
@ApiTags('用户管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard) // 这里千万要保证填写顺序，否则会导致拿到的RoleGuard中拿到的user是undefined
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  // @UseGuards(JwtAuthGuard, RoleGuard) // 这里千万要保证填写顺序，否则会导致拿到的RoleGuard中拿到的user是undefined
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({ summary: '创建用户', description: '创建用户只能管理员在管理端操作' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('list')
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({ summary: '用户列表', description: '查询用户列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: UserFilter) {
    return this.userService.findAll(param);
  }

  @Post('detail')
  @Role(['admin', 'guest'])
  @HttpCode(200)
  @ApiOperation({
    summary: '用户详情',
    description: '查询指定用户的详细信息'
  })
  @ApiBody({
    schema: {
      ...userIdSchema
    }
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Body('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('update')
  @Role(['admin', 'guest']) 
  @HttpCode(200)
  @ApiOperation({
    summary: '更新用户',
    description: '更新用户信息'
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Post('delete')
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({
    summary: '删除用户',
    description: '只能管理员在管理端删除'
  })
  @ApiBody({
    schema: {
      ...userIdSchema
    }
  })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Body('id') id: number) {
    return this.userService.remove(id);
  }

  @Post('resetPwd')
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({
    summary: '重置用户密码',
    description: '将用户密码重置为000000，只能管理员在管理端删除'
  })
  @ApiBody({
    schema: {
      ...userIdSchema
    }
  })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  async resetPwd (@Body('id') id: number) {
    return this.userService.changePwd(id, '000000')
  }

  @Post('current')
  @Role(['admin', 'guest'])
  @HttpCode(200)
  @ApiOperation({
    summary: '当前登录用户',
    description: '获取当前登录状态的用户'
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  async current (@User() user: UserType) {
    return this.userService.findProfile(user.id)
  }

  @Post('changePwd')
  @Role(['admin', 'guest'])
  @HttpCode(200)
  @ApiOperation({
    summary: '修改密码',
    description: '修改密码，所有人都能操作'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          description: '新密码'
        },
        old_password: {
          type: 'string',
          description: '旧密码'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: '修改成功' })
  async changePwd (@Body('password') password: string, @Body('old_password') old_password: string, @User() user: UserType) {
    return this.userService.changePwd(user.id, password, old_password, 'change')
  }

  @Post('toggle')
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({
    summary: '切换用户状态',
    description: '切换用户状态，管理员操作'
  })
  @ApiBody({
    schema: {
      ...userIdSchema
    }
  })
  @ApiResponse({ status: 200, description: '修改成功' })
  async toggle (@Body('id') id: number) {
    return this.userService.toggle(id)
  }

  @Post('habits/detail')
  @HttpCode(200)
  @ApiOperation({
    summary: '用户习惯',
    description: '查询用户习惯'
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  async habitsDetail (@User() user: UserType) {
    console.log('user:', user.id)
    return this.userService.getUserHabits(user.id)
  }

  @Post('habits/update')
  @HttpCode(200)
  @ApiOperation({
    summary: '更新用户习惯',
    description: '更新用户习惯'
  })
  @ApiResponse({ status: 200, description: '更新成功' })
  async habitsUpdate (@Body() param: UpdateHabitDto, @User() user: UserType) {
    return this.userService.updateUserHabits(param, user.id)
  }
}
