import { Injectable } from '@nestjs/common';
import { AlbumFilter, AlbumImagesFilter, CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from './entities/album.entity';
import { Op } from 'sequelize';
import sequelize from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AlbumTag } from 'src/album-tags/entities/album-tag.entity';
import { Image } from 'src/image/entities/image.entity';
import { LogService } from 'src/log/log.service';
import { LogType } from 'src/log/dto/create-log.dto';

@Injectable()
export class AlbumService {
  constructor (
    @InjectModel(Album) private albumModel: typeof Album,
    @InjectModel(AlbumTag) private albumTagModel: typeof AlbumTag,
    @InjectModel(Image) private imageModel: typeof Image,
    private readonly logService: LogService,
    private sequelize: Sequelize
  ) {}

  /**
   * 创建相册：还应当记录日志，同时需要创建相册标签
   * @param createAlbumDto 
   * @param uid 
   * @returns 
   */
  async create(createAlbumDto: CreateAlbumDto, ip: string, uid: number) {
    const { maxSort } = await this.getMaxOrder(uid)
    try {
      let data: Album = null
      await this.sequelize.transaction(async transaction => {
        // 第一步: 创建相册
        data = await this.albumModel.create({
          ...createAlbumDto,
          uid,
          sort: maxSort ? maxSort + 1 : 1
        })
        // 第二步: 创建相册标签
        await this.albumTagModel.create({
          album_id: data.id
        })
        // 第三步: 创建日志
        this.logService.create({
          type: LogType.AlbumCreate,
          operate_id: data.id,
          operate_cont: `创建了相册[${data.name}]`,
        }, ip, uid)
      })
      return data
    } catch (error) {
      
    }
  }

  /**
   * 查询相册列表
   * @param param 
   * @param uid 
   * @returns 
   */
  async findAll(param: AlbumFilter, uid: number) {
    const { page, size, search, access_type /**, sort, order */ } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['sort', 'desc']
      ],
      where: {
        uid: uid,
        name: {
          [Op.like]: search ? `%${search}%` : '%%'
        },
        desc: {
          [Op.like]: search ? `%${search}%` : '%%'
        }
      }
    }
    if (Object.keys(param).includes('access_type') && access_type !== '') {
      tmp.where.access_type = access_type
    }
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.albumModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    // 计算数量
    const promises = data.items.map(async (item: any) => {
      let filter = {
        where: {
          album_id: item.id
        }
      }
      return {
        id: item.id,
        count: await this.imageModel.count(filter)
      }
    })
    return {
      ...data,
      stats: await Promise.all(promises)
    };
  }

  /**
   * 相册详情
   * @param id 
   * @param uid 
   * @returns 
   */
  findOne(id: number, uid: number) {
    return this.albumModel.findOne({
      where: {
        id,
        uid
      },
      include: [AlbumTag]
    });
  }

  /**
   * 更新相册：还应当记录日志
   * @param updateAlbumDto 
   * @param uid 
   * @returns 
   */
  async update(updateAlbumDto: UpdateAlbumDto, ip: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、更新相册
      const data = await this.albumModel.update(updateAlbumDto, {
        where: {
          uid,
          id: updateAlbumDto.id
        }
      });
      // 3、记录日志
      await this.logService.create({
        type: LogType.AlbumUpdate,
        operate_id: updateAlbumDto.id,
        operate_cont: `更新了相册[${updateAlbumDto.name}]`
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
   * 删除相册：还应当记录日志，同时还应将关联该相册的图片置为空
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
      const res = await this.albumModel.destroy({
        where: {
          id,
          uid
        }
      })
      // 3、清除关联关系
      await this.imageModel.update({
        album_id: null
      }, {
        where: {
          album_id: id
        }
      })
      // 3、记录日志
      await this.logService.create({
        type: LogType.AlbumDelete,
        operate_id: data.id,
        operate_cont: `删除了相册[${data.name}]`
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
   * 获取最大的sort值
   * @returns 
   */
  getMaxOrder (uid: number): Promise<any> {
    return this.albumModel.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('sort')), 'maxSort'],
      ],
      where: {
        uid: uid
      },
      raw: true
    })
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
      const fromItem = await this.albumModel.findOne({
        where: {
          id: from,
          uid
        }
      })
      const toItem = await this.albumModel.findOne({
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
      const [fromWeight, toWeight] = [fromItem.sort, toItem.sort]
      fromItem.sort = toWeight
      toItem.sort = fromWeight
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
   * 获取指定相册下的图片
   * @param id 
   * @param uid 
   * @returns 
   */
  async images (param: AlbumImagesFilter, uid: number) {
    // Todo: 获取相册下的图片，分页获取
    // return ''
    const { page, size, search, id } = param
    const tmp: any = {
      attributes: ['id', 'baseurl', 'url', 'name', 'origin_name', 'bucket_id', 'weight', 'tags', 'config', 'add_time'],
      where: {
        name: {
          [Op.like]: search ? `%${search}%` : `%%`
        },
        uid,
        album_id: id
      },
      order: [
        ['weight', 'desc']
      ]
    }
    const data: any = {}
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
      const { count, rows } = await this.imageModel.findAndCountAll({
        ...tmp
      })
      data.total = count
      data.items = rows
    } else {
      const { count, rows } = await this.imageModel.findAndCountAll({
        ...tmp
      })
      data.items = rows
      data.total = count
    }
    return data;
  }
}
