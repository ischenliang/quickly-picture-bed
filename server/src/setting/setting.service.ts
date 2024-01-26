import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingService {
  constructor (@InjectModel(Setting) private settingModel: typeof Setting) {}

  /**
   * 创建设置：首先判断数据库中是否有记录，没有才创建
   * @param createSettingDto 
   * @returns 
   */
  async create(createSettingDto: CreateSettingDto) {
    const list = await this.findAll()
    if (list.length) {
      return {
        statusCode: 500,
        data: '已有默认系统配置'
      }
    }
    return this.settingModel.create(createSettingDto);
  }

  /**
   * 查询列表
   * @returns 
   */
  findAll() {
    return this.settingModel.findAll();
  }

  /**
   * 设置详情
   * @param id 
   * @returns 
   */
  findOne() {
    return this.settingModel.findOne();
  }

  /**
   * 更新配置
   * @param updateSettingDto 
   * @returns 
   */
  update(updateSettingDto: UpdateSettingDto) {
    delete updateSettingDto.id
    return this.settingModel.update(updateSettingDto, {
      where: {}
    })
  }
}
