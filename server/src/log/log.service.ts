import { Injectable } from '@nestjs/common';
import { ClientInfo, CreateLogDto, LogFilter, LogType } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import * as iptoaddress from 'ip-to-address'
import { Setting } from 'src/setting/entities/setting.entity';
import { User } from 'src/user/entities/user.entity';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class LogService {
  constructor (
    @InjectModel(Log) private logModel: typeof Log,
    @InjectModel(Setting) private settingModel: typeof Setting,
    @InjectModel(User) private userModel: typeof User,
    private sequelize: Sequelize
  ) {}

  /**
   * ip地址转为详细地址信息
   * @param ip 
   * @returns 
   */
  private async ipToAddress (ip: string) {
    const setting = await this.settingModel.findOne()
    const result = {
      ip: ip,
      adcode: '',
      province: '未知',
      city: '未知',
      district: '未知',
      type: '',
      rectangle: {
        x: '', y: ''
      }
    }
    const { map_key, map_type } = setting.system
    switch(map_type) {
      case 'baidu':
        result.type = 'baidu'
        const baidu = await iptoaddress.baidu(ip, map_key)
        if (baidu.status === 0) {
          const { adcode, city, province } = baidu.content.address_detail
          result.adcode = adcode
          result.province = province
          result.city = city
          result.rectangle = baidu.content.point
        }
        break
      case 'gaode':
        result.type = 'gaode'
        const gaode = await iptoaddress.amap(ip, map_key)
        if (gaode.status && gaode.status === '1') {
          const { adcode, province, city, rectangle } = gaode
          result.adcode = adcode
          result.province = province
          result.city = city
          const [x, y] = rectangle.split(';').split(';').shift().split(',')
          result.rectangle.x = x
          result.rectangle.y = y
        }
        break
      case 'tencent':
        result.type = 'tencent'
        const tencent = await iptoaddress.qq(ip, map_key)
        if (tencent.status && tencent.status === 0) {
          const { adcode, province, city, district } = tencent.result.ad_info
          result.adcode = adcode
          result.province = province
          result.city = city
          result.district = district
          const { lat: x, lng: y } = tencent.result.location
          result.rectangle.x = x
          result.rectangle.y = y
        }
        break
      default:
        result.type = 'unkown'
        break
    }
    return result
  }

  /**
   * 创建日志
   * @param createLogDto 
   * @param ip 
   * @param uid 
   * @returns 
   */
  async create(createLogDto: CreateLogDto, ip: string, uid: number) {
    const ipInfo: ClientInfo = await this.ipToAddress(ip)
    const user = await this.userModel.findOne({ where: { id: uid } })
    createLogDto.client_info = ipInfo
    createLogDto.uid = uid
    createLogDto.email = user.email
    return this.logModel.create(createLogDto)
  }

  /**
   * 所有日志列表
   * @param param 
   * @param uid 
   * @returns 
   */
  async all(param: LogFilter, uid: number) {
    const { page, size, type } = param
    const tmp: any = {
      where: {
      },
      order: [
        ['updatedAt', 'desc']
      ]
    }
    if (type) {
      tmp.where.type = type
    }
    const data: any = {}
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.logModel.findAndCountAll({
      ...tmp
    })
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 日志列表
   * @param param 
   * @param uid 
   * @returns 
   */
  async findAll(param: LogFilter, uid: number) {
    const { page, size, type } = param
    const tmp: any = {
      where: {
        uid
      },
      order: [
        ['updatedAt', 'desc']
      ]
    }
    if (type) {
      tmp.where.type = type
    }
    const data: any = {}
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.logModel.findAndCountAll({
      ...tmp
    })
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 查询贡献列表
   * @param uid 
   * @returns 
   */
  contributes(uid: number) {
    return this.logModel.findAll({
      where: {
        uid,
        type: {
          [Op.or]: [LogType.PictureUpload, LogType.PictureUpdate, LogType.PictureDelete]
        }
      },
      attributes: [
        [this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
        [this.sequelize.fn('COUNT', 'id'), 'count']
      ],
      group: ['date']
    })
  }

  /**
   * 删除日志
   * @param id 
   * @returns 
   */
  remove(id: number) {
    return this.logModel.destroy({
      where: {
        id
      }
    });
  }

  /**
   * 重新定位
   * @param id 
   * @returns 
   */
  async reLocate (id: number, ip: string) {
    const log = await this.logModel.findOne({
      where: {
        id
      },
      raw: true
    })
    const ipInfo: ClientInfo = await this.ipToAddress(log.client_info.ip || ip)
    return this.logModel.update({
      client_info: ipInfo
    }, {
      where: {
        id
      },
      silent: true
    })
  }
}
