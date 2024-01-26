import { Injectable } from '@nestjs/common';
import { CreatePluginDto, PluginFilter } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Plugin } from './entities/plugin.entity';
import sequelize from 'sequelize';
import { Op } from 'sequelize';
import { UserPlugin } from './entities/user-plugin.entity';
import { Sequelize } from 'sequelize-typescript';
import { BucketService } from 'src/bucket/bucket.service';
import { LogService } from 'src/log/log.service';
import { LogType } from 'src/log/dto/create-log.dto';
import { Habits } from 'src/user/entities/habits.entity';

@Injectable()
export class PluginService {
  constructor (
    @InjectModel(Plugin) private pluginModel: typeof Plugin, 
    @InjectModel(Habits) private habitsModel: typeof Habits, 
    @InjectModel(UserPlugin) private userPluginModel: typeof UserPlugin,
    private readonly bucketService: BucketService,
    private readonly logService: LogService,
    private readonly sequelize: Sequelize
  ) {}
  /**
   * 创建插件
   * @param createPluginDto 
   * @returns 
   */
  async create(createPluginDto: CreatePluginDto) {
    const { maxWeight } = await this.getMaxWeight()
    return this.pluginModel.create({
      ...createPluginDto,
      weight: maxWeight ? maxWeight + 1 : 1
    });
  }

  /**
   * 查询所有插件
   * @param param 
   * @returns 
   */
  async findAll(param: PluginFilter, uid: number) {
    const { page, size, search, category, status } = param
    const tmp: any = {
      where: {
        title: {
          [Op.like]: search ? `%${search}%` : `%%`
        }
      },
      order: [
        ['weight', 'desc']
      ],
      raw: true
    }
    const data: any = {}
    if (category) {
      tmp.where.category = category
    }
    if (Object.keys(param).includes('status')) {
      tmp.where.status = status
    }
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.pluginModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    const promises = data.items.map(async el => {
      return await this.userPluginModel.findOne({
        where: {
          uid,
          pid: el.id
        },
        raw: true,
        attributes: ['id', 'pid', 'uid', 'status', 'version']
      })
    })
    const user_plugins = await Promise.all(promises)
    data.items = data.items.map(el => {
      return {
        ...el,
        user_plugin: user_plugins.find(user_plugin => user_plugin && user_plugin.uid === uid && user_plugin.pid === el.id) || {}
      }
    })
    return data
  }

  /**
   * 获取最大的weight值
   * @returns 
   */
  getMaxWeight (): Promise<any> {
    return this.pluginModel.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight'],
      ],
      raw: true
    })
  }

  /**
   * 查询指定插件详情
   * @param id 
   * @returns 
   */
  async findOne(id: number, uid: number) {
    const plugin = await this.pluginModel.findOne({
      where: {
        id
      },
      raw: true
    });
    const user_plugin = await this.userPluginModel.findOne({
      where: {
        pid: plugin.id,
        uid
      }
    })
    return {
      ...plugin,
      user_plugin: user_plugin ? user_plugin : {}
    }
  }

  /**
   * 更新插件
   * @param updatePluginDto 
   * @returns 
   */
  update(updatePluginDto: UpdatePluginDto) {
    return this.pluginModel.update(updatePluginDto, {
      where: {
        id: updatePluginDto.id
      }
    });
  }

  /**
   * 删除插件
   * @param id 插件id
   * @returns 
   */
  remove(id: number) {
    // Todo: 删除插件的同时需要将用户安装记录、存储桶都给删除
    // 或者直接将其设置为空
    return this.pluginModel.destroy({
      where: {
        id
      }
    })
  }

  /**
   * 安装插件
   * @param id 插件id
   * @param secret_key 插件安装秘钥
   * @param uid 用户id
   */
  async install (id: number, ip: string, secret_key: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、查询数据
      const plugin = await this.pluginModel.findOne({
        where: {
          id
        }
      })
      if (!plugin) {
        return {
          statusCode: 500,
          data: '插件不存在'
        }
      }
      // 3、更新插件和安装插件
      // 首先判断插件是否需要付费
      // 如果需要：则需要校验秘钥是否有效
      await this.pluginModel.update({
        downloadCounts: plugin.downloadCounts + 1
      }, {
        where: {
          id
        }
      })
      const res = this.userPluginModel.create({
        pid: id,
        uid,
        version: plugin.version
      })
      // 4、记录日志
      await this.logService.create({
        type: LogType.PluginInstall,
        operate_id: plugin.id,
        operate_cont: `安装了插件[${plugin.title}]`
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
   * 更新安装插件
   * @param id 
   * @param uid 
   */
  async updateIntsall (id: number, ip: string, uid: number) {
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、获取插件
      const plugin = await this.pluginModel.findOne({
        where: {
          id
        },
        raw: true
      })
      if (!plugin) {
        return {
          statusCode: 500,
          data: '插件不存在'
        }
      }
      // 3、更新安装记录
      let res = await this.userPluginModel.update({
        version: plugin.version
      }, {
        where: {
          pid: id,
          uid
        }
      })
      // 3、记录日志
      await this.logService.create({
        type: LogType.PluginInstallUpdate,
        operate_id: plugin.id,
        operate_cont: `安装了最新版插件[${plugin.title}]`
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
   * 卸载插件
   * @param id 插件id
   * @param uid 用户id
   */
  async uninstall (id: number, ip: string, uid: number) {
    // Todo: 还应考虑是否删除关联的存储桶
    const plugin = await this.pluginModel.findOne({
      where: {
        id
      }
    })
    if (plugin) {
      let result: any = null
      // 查询已安装的插件
      const user_plugin = await this.userPluginModel.findOne({
        where: {
          pid: id,
          uid
        },
        raw: true
      })
      if (user_plugin && user_plugin.id) {
        try {
          await this.sequelize.transaction(async transaction => {
            // 第一步：删除存储桶
            await this.bucketService.removeByPluginId(user_plugin.id, uid)
            // 第二步：删除已安装的插件
            result = await this.userPluginModel.destroy({
              where: {
                pid: id,
                uid
              }
            })
            // 第三步：清空用户习惯的主题，还需要判断是否是当前的习惯
            const userHabits = await this.habitsModel.findOne({ where: { uid } })
            if (userHabits.current_theme && userHabits.current_theme.plugin_id === plugin.id) {
              await this.habitsModel.update({
                current_theme: {
                  id: 0,
                  plugin_id: 0
                }
              }, {
                where: { uid }
              })
            }
            // 第三步: 记录日志
            await this.logService.create({
              type: LogType.PluginUninstall,
              operate_id: plugin.id,
              operate_cont: `卸载了插件[${plugin.title}]`
            }, ip, uid)
          })
        } catch (error) {
          
        }
        return result
      } else {
        return {
          statusCode: 500,
          data: '该插件并未安装'
        }
      }
    } else {
      return {
        statusCode: 500,
        data: '插件不存在'
      }
    }
  }

  /**
   * 获取用户安装插件列表
   * @param uid 
   */
  async getUserPlugins (status: boolean, type: string, uid: number) {
    const data: any = {}
    const where: any = {}
    if (type) {
      where.category = type
    }
    data.items = await this.userPluginModel.findAll({
      where: {
        uid: uid,
        status: status
      },
      include: [
        {
          model: Plugin,
          where: where
        }
      ],
      order: [['updatedAt', 'desc']]
    })
    return data
  }

  /**
   * 切换已安装插件状态，启用或禁用
   * @param id 插件id
   * @param uid 用户id
   * @returns 
   */
  async toggleIntsall (id: number, uid: number) {
    const userPlugin = await this.userPluginModel.findOne({
      where: {
        id,
        uid
      }
    })
    return this.userPluginModel.update({
      status: !userPlugin.status
    }, {
      where: {
        id,
        uid
      }
    })
  }

  /**
   * 切换插件状态，启用或禁用
   * @param id 插件id
   * @param uid 用户id
   * @returns 
   */
  async toggle (id: number, uid: number) {
    const plugin = await this.pluginModel.findOne({
      where: {
        id
      },
      raw: true
    })
    if (plugin) {
      return this.pluginModel.update({
        status: !plugin.status
      }, {
        where: {
          id
        }
      })
    }
    return {
      statusCode: 500,
      data: '插件不存在'
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
      const fromItem = await this.pluginModel.findOne({
        where: {
          id: from
        },
        transaction
      })
      const toItem = await this.pluginModel.findOne({
        where: {
          id: to
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
