import { Injectable } from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';
import { PluginLoaderService } from 'src/common/pluginLoader.service';
import { InjectModel } from '@nestjs/sequelize';
import { Bucket } from 'src/bucket/entities/bucket.entity';
import { UserPlugin } from 'src/plugin/entities/user-plugin.entity';
import { Plugin } from 'src/plugin/entities/plugin.entity';
import { FileItem } from 'src/interface';
import sequelize from 'sequelize';
import { Image } from './entities/image.entity';
import { ImageFilter } from './dto/create-image.dto';
import { Op } from 'sequelize';
import { TimeService } from 'src/common/time.service';
import { Sequelize } from 'sequelize-typescript';
import { Album } from 'src/album/entities/album.entity';
import { LogService } from 'src/log/log.service';
import { LogType } from 'src/log/dto/create-log.dto';

export enum ResponseCode {
  NotMatch = 50001, // 第三方返回结果类型不匹配
  ThrowError = 50002 // 第三方接口报错
}

@Injectable()
export class ImageService {
  constructor (
    private readonly pluginLoaderService: PluginLoaderService,
    private readonly timeService: TimeService,
    private readonly logService: LogService,
    @InjectModel(Image) private imageModel: typeof Image,
    @InjectModel(Bucket) private bucketModel: typeof Bucket,
    @InjectModel(Album) private albumModel: typeof Album,
    private sequelize: Sequelize
  ) {}

  /**
   * 上传文件，需要考虑如果是覆盖文件的话，只能选择单张图片
   * 同时需要考虑是否更新了存储桶
   * @param files 
   * @param param 
   * @param uid 
   * @returns 
   */
  async upload(files: Array<Express.Multer.File>, ip: string, param: { bucket_id: number; album_id: number; image_id: number }, uid: number) {
    const { bucket_id, image_id, album_id } = param
    // 1、获取存储桶
    const bucket = await this.bucketModel.findOne({
      where: {
        id: bucket_id,
        uid: uid
      },
      include: [
        {
          model: UserPlugin,
          include: [
            { model: Plugin }
          ]
        }
      ]
    })
    // 2、构建运行沙箱
    const sandbox = await this.pluginLoaderService.resolvePlugin(bucket.dataValues.user_plugin.dataValues.plugin)
    // 3、上传图片
    try {
      const images: FileItem[] = await this.pluginLoaderService.upload(sandbox, files, bucket.config)
      // 3.1、错误处理
      const errors = images.filter(el => el.code && el.code === 500)
      if (errors.length) {
        return {
          statusCode: ResponseCode.NotMatch,
          data: errors[0].message
        }
      }
      // 3.2、正常处理
      const { maxWeight } = await this.getMaxWeight(uid)
      const promises = images.map(async el => {
        const { img_url, weight, ...image } = el
        // 3.2.1、如果有图片id，则代表是更新图片
        if (image_id) {
          // 先更新图片数据
          await this.imageModel.update({
            ...image,
            url: img_url,
            bucket_id: bucket_id,
            album_id: album_id,
            uid: uid,
            add_time: album_id ? this.timeService.formatTime() : null
          }, {
            where: {
              id: image_id,
              uid
            }
          })
          // 再返回图片数据
          return await this.imageModel.findOne({
            where: {
              id: image_id,
              uid
            }
          })
        }
        // 3.2.2、如果有相册id，判断相册是否有封面，没有则设置为相册封面
        if (album_id) {
          const album = await this.albumModel.findOne({
            where: {
              id: album_id,
              uid: uid
            }
          })
          if (album && !album.cover) {
            await this.albumModel.update({
              cover: image.baseurl + img_url
            }, {
              where: {
                id: album_id,
                uid
              }
            })
          }
        }
        // 3.2.3、创建图片记录
        const res = await this.imageModel.create({
          ...image,
          url: img_url,
          bucket_id: bucket_id,
          album_id: album_id,
          weight: maxWeight ? maxWeight + weight + 1 : weight + 1,
          uid: uid,
          add_time: album_id ? this.timeService.formatTime() : null
        })
        // 3.2.4、创建日志
        this.logService.create({
          type: LogType.PictureUpload,
          operate_id: res.id,
          operate_cont: `上传了图片[${res.origin_name}]`,
        }, ip, uid)
        return res
      })
      return Promise.all(promises)
    } catch (error) {
      console.log('=======', error, '=====')
      return {
        statusCode: ResponseCode.ThrowError,
        data: error
      }
    }
  }

  /**
   * 获取最大的weight值
   * @returns 
   */
  private getMaxWeight (uid: number): Promise<any> {
    return this.imageModel.findOne({
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
   * 图片列表
   * @param param 
   * @param uid 
   * @returns 
   */
  async findAll(param: ImageFilter, uid: number) {
    const { page, size, search, bucket_id, album_id } = param
    const tmp: any = {
      attributes: ['id', 'baseurl', 'url', 'name', 'origin_name', 'bucket_id', 'weight', 'tags', 'config', 'add_time'],
      where: {
        [Op.or]: {
          name: {
            [Op.like]: search ? `%${search}%` : `%%`
          },
          origin_name: {
            [Op.like]: search ? `%${search}%` : `%%`
          },
        },
        uid
      },
      order: [
        ['weight', 'desc']
      ]
    }
    if (bucket_id) {
      tmp.where.bucket_id = bucket_id
    }
    if (album_id) {
      tmp.where.album_id = album_id
    }
    const data: any = {}
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.imageModel.findAndCountAll({
      ...tmp
    })
    data.items = rows
    data.total = count
    return data;
  }

  /**
   * 图片详情
   * @param id 
   * @param uid 
   * @returns 
   */
  findOne(id: number, uid: number) {
    return this.imageModel.findOne({
      where: {
        id,
        uid
      }
    });
  }

  /**
   * 更新图片
   * @param param 
   * @param uid 
   * @returns 
   */
  async update(param: UpdateImageDto, ip: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、更新图片
      const data = await this.imageModel.update({
        name: param.name,
        origin_name: param.origin_name,
        config: param.config,
        tags: param.tags,
        album_id: param.album_id,
        add_time: param.add_time ? param.add_time : this.timeService.formatTime()
      }, {
        where: {
          id: param.id,
          uid
        }
      })
      const image = await this.imageModel.findOne({ where: { id: param.id, uid } })
      // 3、记录日志
      await this.logService.create({
        type: LogType.PictureUpdate,
        operate_id: param.id,
        operate_cont: `更新了图片[${image.origin_name} - ${image.name}]`
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
   * 删除图片，还需要考虑是否删除对象存储上的图片
   * @param id 
   * @param uid 
   * @returns 
   */
  async remove(id: number, ip: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、查询相册并删除
      const data = await this.findOne(id, uid)
      const res = await this.imageModel.destroy({
        where: {
          id,
          uid
        }
      })
      // 3、记录日志
      await this.logService.create({
        type: LogType.PictureDelete,
        operate_id: data.id,
        operate_cont: `删除了图片[${data.origin_name}]`
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
   * 拖拽排序
   * @param from 
   * @param to 
   * @returns 
   */
  async sort (from: number, to: number, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、查询拖拽元素和被拖拽元素
      const fromItem = await this.imageModel.findOne({
        where: {
          id: from,
          uid
        },
        transaction
      })
      const toItem = await this.imageModel.findOne({
        where: {
          id: to,
          uid
        },
        transaction
      })
      if (!fromItem || !toItem) {
        return {
          statusCode: 500,
          data: 'from或to元素不存在'
        }
      }
      // 3、交换拖拽元素和被拖拽元素的weight值
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
}
