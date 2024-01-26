import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { Role } from 'src/common/role.descorator';

@Controller({
  path: 'setting',
  version: '1'
})
@ApiTags('系统设置')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({ summary: '创建系统配置', description: '创建系统配置，只有当系统配置不存在时创建' })
  @ApiResponse({ status: 200, description: '创建成功' })
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto);
  }

  @Post('update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({ summary: '更新系统配置', description: '更新系统配置' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(updateSettingDto);
  }

  @Post('detail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(['admin'])
  @HttpCode(200)
  @ApiOperation({ summary: '系统配置详情', description: '系统配置详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne() {
    return this.settingService.findOne();
  }

  @Post('default')
  @HttpCode(200)
  @ApiOperation({ summary: '默认配置', description: '系统默认配置' })
  @ApiResponse({ status: 200, description: '查询成功' })
  default() {
    return this.settingService.findOne();
  }
}
