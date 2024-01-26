import { Injectable } from '@nestjs/common';
import { BucketFilter, CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Bucket } from './entities/bucket.entity';
import { Sequelize } from 'sequelize-typescript';
import sequelize, { where } from 'sequelize';
import { Op } from 'sequelize';
import { UserPlugin } from 'src/plugin/entities/user-plugin.entity';
import { Plugin } from 'src/plugin/entities/plugin.entity';
import { LogService } from 'src/log/log.service';
import { LogType } from 'src/log/dto/create-log.dto';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class BucketService {

  constructor (
    @InjectModel(Bucket) private bucketModel: typeof Bucket,
    @InjectModel(Image) private imageModel: typeof Image,
    private readonly logService: LogService,
    private readonly sequelize: Sequelize
  ) {}

  /**
   * 创建存储桶
   * @param createBucketDto 
   * @param uid 
   * @returns 
   */
  async create(createBucketDto: CreateBucketDto, ip: string, uid: number) {
    const { maxWeight } = await this.getMaxWeight(uid)
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、创建存储桶
      const data = await this.bucketModel.create({
        ...createBucketDto,
        uid,
        weight: maxWeight ? maxWeight + 1 : 1
      });
      // 3、记录日志
      await this.logService.create({
        type: LogType.BucketCreate,
        operate_id: data.id,
        operate_cont: `创建了存储桶[${data.name}]`
      }, ip, uid)
      // 4、提交事务
      await transaction.commit()
      return data
    } catch (error) {
      // 回滚事务
      await transaction.rollback()
      return {
        statusCode: 500,
        data: '事务异常' + error.message
      }
    }
  }

  /**
   * 获取最大的weight值
   * @returns 
   */
  getMaxWeight (uid: number): Promise<any> {
    return this.bucketModel.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight'],
      ],
      where: {
        uid
      },
      raw: true
    })
  }

  /**
   * 存储桶列表
   * @param param 
   * @param uid 
   * @returns 
   */
  async findAll(param: BucketFilter, uid: number) {
    const { page, size, search, visible } = param
    const tmp: any = {
      where: {
        name: {
          [Op.like]: search ? `%${search}%` : `%%`
        },
        uid
      },
      order: [
        ['weight', 'desc']
      ]
    }
    if (param.is_only_names) {
      tmp.attributes = ['id', 'name']
    }
    if (Object.keys(param).includes('visible')) {
      tmp.where.visible = visible
    }
    const data: any = {}
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.bucketModel.findAndCountAll({
      ...tmp,
      include: param.is_only_names ? [] : [
        {
          model: UserPlugin,
          as: 'user_plugin',
          include: [
            { model: Plugin, as: 'plugin' }
          ]
        }
      ]
    })
    data.total = count
    data.items = rows
    // 计算占用存储和总数量
    let res = {
      ...data
    }
    if (!param.is_only_names) {
      res.stats = await Promise.all(data.items.map(async (item: Bucket) => {
        return {
          id: item.id,
          bucket_storage: await this.imageModel.sum('size', { where: { bucket_id: item.id } }),
          bucket_count: await this.imageModel.count({ where: { bucket_id: item.id } })
        }
      }))
    }
    return res
  }

  /**
   * 存储桶详情
   * @param id 
   * @param uid 
   * @returns 
   */
  findOne(id: number, uid: number) {
    return this.bucketModel.findOne({
      where: {
        id,
        uid
      }
    });
  }

  /**
   * 更新存储桶
   * @param updateBucketDto 
   * @param uid 
   * @returns 
   */
  async update(updateBucketDto: UpdateBucketDto, ip: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、更新存储桶
      const data = this.bucketModel.update({
        ...updateBucketDto
      }, {
        where: {
          id: updateBucketDto.id,
          uid
        }
      })
      // 3、记录日志
      await this.logService.create({
        type: LogType.BucketUpdate,
        operate_id: updateBucketDto.id,
        operate_cont: `更新了存储桶[${updateBucketDto.name}]`
      }, ip, uid)
      // 4、提交事务
      await transaction.commit()
      return data
    } catch (error) {
      // 回滚事务
      await transaction.rollback()
      return {
        statusCode: 500,
        data: '事务异常' + error.message
      }
    }
  }

  /**
   * 删除存储桶
   * @param id 
   * @param uid 
   * @returns 
   */
  async remove(id: number, ip: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、查询存储桶并删除
      const data = await this.findOne(id, uid)
      const res = await this.bucketModel.destroy({
        where: {
          id,
          uid
        }
      });
      // 3、记录日志
      await this.logService.create({
        type: LogType.BucketDelete,
        operate_id: data.id,
        operate_cont: `删除了存储桶[${data.name}]`
      }, ip, uid)
      // 4、提交事务
      await transaction.commit()
      return res
    } catch (error) {
      // 回滚事务
      await transaction.rollback()
      return {
        statusCode: 500,
        data: '事务异常' + error.message
      }
    }
  }

  /**
   * 切换状态
   * @param id 
   * @param uid 
   * @returns 
   */
  async toggle (id: number, uid: number) {
    const tmp = await this.bucketModel.findOne({
      where: {
        id,
        uid
      },
      raw: true
    })
    if (tmp) {
      return this.bucketModel.update({
        visible: !tmp.visible
      }, {
        where: {
          id,
          uid
        }
      })
    }
    return { statusCode: 500, data: '存储桶不存在' }
  }

  /**
   * 拖拽排序
   * @param from 
   * @param to 
   * @returns 
   */
  async sort (from: number, to: number, uid: number) {
    // 1、开始 Sequelize 事务
    const transaction = await this.sequelize.transaction()
    try {
      // 2、查询拖拽元素和被拖拽元素
      const fromItem = await this.bucketModel.findOne({
        where: {
          id: from,
          uid
        }
      })
      const toItem = await this.bucketModel.findOne({
        where: {
          id: to,
          uid
        }
      })
      if (!fromItem || !toItem) {
        return {
          statusCode: 500,
          data: 'from或to元素不存在'
        }
      }
      // 3、交换替换元素和被拖拽元素weight值
      const [fromWeight, toWeight] = [fromItem.weight, toItem.weight]
      fromItem.weight = toWeight
      toItem.weight = fromWeight
      // 4、保存更新后的元素
      await fromItem.save({ transaction })
      await toItem.save({ transaction })
      // 5、提交事务
      await transaction.commit()
      return [fromItem, toItem]
    } catch (error) {
      // 回滚事务
      await transaction.rollback()
      return {
        statusCode: 500,
        data: '事务异常' + error.message
      }
    }
  }

  /**
   * 删除存储桶：根据安装插件id，还应记录日志
   * @param user_plugin_id 
   * @param uid 
   * @returns 
   */
  removeByPluginId (user_plugin_id: number, uid: number) {
    return this.bucketModel.destroy({
      where: {
        user_plugin_id: user_plugin_id,
        uid: uid
      }
    })
  }
}
