import { Injectable } from '@nestjs/common';
import { CreateDictDto, DictFilter } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Dict } from './entities/dict.entity';
import { Op } from 'sequelize';

@Injectable()
export class DictService {

  constructor (@InjectModel(Dict) private dictModel: typeof Dict) {}

  /**
   * 创建字典
   * @param createDictDto 
   * @returns 
   */
  create(createDictDto: CreateDictDto) {
    return this.dictModel.create(createDictDto);
  }

  /**
   * 字典列表
   * @param param 
   * @returns 
   */
  async findAll(param: DictFilter) {
    const { page, size, search } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        name: {
          [Op.like]: search ? `%${search}%` : '%%'
        }
      }
    }
    if (page) {
      tmp.limit = size
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.dictModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 地点详情
   * @param id 
   * @returns 
   */
  findOne(id: number) {
    return this.dictModel.findOne({
      where: {
        id
      }
    });
  }

  /**
   * 更新字典
   * @param updateDictDto 
   * @returns 
   */
  update(updateDictDto: UpdateDictDto) {
    return this.dictModel.update(updateDictDto, {
      where: {
        id: updateDictDto.id
      }
    });
  }

  /**
   * 删除字典
   * @param id 
   * @returns 
   */
  remove(id: number) {
    return this.dictModel.destroy({
      where: {
        id
      }
    });
  }

  /**
   * 按属性插字典
   * @param param 
   * @returns 
   */
  findByPro (param: { property: string, value: string }) {
    return this.dictModel.findOne({
      where: {
        [param.property]: param.value
      }
    })
  }
}
