import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Album } from 'src/album/entities/album.entity';
import { Article } from 'src/article/entities/article.entity';
import { Bucket } from 'src/bucket/entities/bucket.entity';
import { Image } from 'src/image/entities/image.entity';
import { Log } from 'src/log/entities/log.entity';
import { Plugin } from 'src/plugin/entities/plugin.entity';
import { UserPlugin } from 'src/plugin/entities/user-plugin.entity';
import { User } from 'src/user/entities/user.entity';
import { Wiki } from 'src/wiki/entities/wiki.entity';

@Injectable()
export class StatsService {
  constructor (
    @InjectModel(Image) private imageModel: typeof Image,
    @InjectModel(Bucket) private bucketModel: typeof Bucket,
    @InjectModel(Plugin) private pluginModel: typeof Plugin,
    @InjectModel(Album) private albumModel: typeof Album,
    @InjectModel(Wiki) private wikiModel: typeof Wiki,
    @InjectModel(Log) private logModel: typeof Log,
    @InjectModel(Article) private articleModel: typeof Article,
    @InjectModel(UserPlugin) private userPluginModel: typeof UserPlugin,
    @InjectModel(User) private userModel: typeof User,
    private sequelize: Sequelize
  ) {}

  /**
   * 获取管理员的面板数据
   * @returns 
   */
  async getAdminBanner () {
    // 1、查询数据总量
    const [imageTotal, bucketTotal, wikiTotal, albumTotal, pluginTotal, articleTotal] = [
      await this.imageModel.count(),
      await this.bucketModel.count(),
      await this.wikiModel.count(),
      await this.albumModel.count(),
      await this.userModel.count(),
      await this.articleModel.count()
    ]
    // 2、查询今日数据
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置时间为今天的凌晨 0 点
    const [imageToday, bucketToday, wikiToday, albumToday, pluginToday, articleToday] = [
      await this.imageModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          }
        }
      }),
      await this.bucketModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          }
        }
      }),
      await this.wikiModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          }
        }
      }),
      await this.albumModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          }
        }
      }),
      await this.userModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          }
        }
      }),
      await this.articleModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          }
        }
      })
    ]
    // 3、返回数据
    return {
      image: {
        total: imageTotal,
        today: imageToday
      },
      bucket: {
        total: bucketTotal,
        today: bucketToday
      },
      album: {
        total: albumTotal,
        today: albumToday
      },
      user: {
        total: pluginTotal,
        today: pluginToday
      },
      wiki: {
        total: wikiTotal,
        today: wikiToday
      },
      article: {
        total: articleTotal,
        today: articleToday
      }
    }
  }

  /**
   * 获取面板数据
   * @param uid 
   * @returns
   */
  async getBanner (uid: number) {
    const res = await this.logModel.findAll({
      attributes: ['id', 'client_info']
    })
    // 1、查询数据总量
    const [imageTotal, bucketTotal, wikiTotal, albumTotal, pluginTotal, articleTotal] = [
      await this.imageModel.count({ where: { uid } }),
      await this.bucketModel.count({ where: { uid } }),
      await this.wikiModel.count({ where: { uid } }),
      await this.albumModel.count({ where: { uid } }),
      await this.userPluginModel.count({ where: { uid } }),
      await this.articleModel.count({ where: { uid } })
    ]
    // 2、查询今日数据
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置时间为今天的凌晨 0 点
    const [imageToday, bucketToday, wikiToday, albumToday, pluginToday, articleToday] = [
      await this.imageModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          },
          uid
        }
      }),
      await this.bucketModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          },
          uid
        }
      }),
      await this.wikiModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          },
          uid
        }
      }),
      await this.albumModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          },
          uid
        }
      }),
      await this.userPluginModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          },
          uid
        }
      }),
      await this.articleModel.count({
        where: {
          createdAt: {
            [Op.gt]: today
          },
          uid
        }
      })
    ]
    // 3、返回数据
    return {
      image: {
        total: imageTotal,
        today: imageToday
      },
      bucket: {
        total: bucketTotal,
        today: bucketToday
      },
      album: {
        total: albumTotal,
        today: albumToday
      },
      plugin: {
        total: pluginTotal,
        today: pluginToday
      },
      wiki: {
        total: wikiTotal,
        today: wikiToday
      },
      article: {
        total: articleTotal,
        today: articleToday
      }
    }
  }

  /**
   * 查询近一周的动态
   * @param uid 
   * @returns 
   */
  getRecentLogs (uid: number) {
    // 设置时间为今天的凌晨 0 点
    const today = new Date();
    today.setHours(24, 0, 0, 0);
    // 获取七天前的日期
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    console.log('ccc')
    return this.logModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
          [Op.lte]: today,
        },
        uid
      }
    })
  }

  /**
   * 获取占比数据
   * @param uid 
   * @returns 
   */
  async getPercentData (uid: number) {
    const bucket = await this.bucketModel.findAll({
      attributes: ['id', 'name'],
      where: {
        uid
      }
    })
    const album = await this.albumModel.findAll({
      attributes: ['id', 'name'],
      where: {
        uid
      }
    })
    const wiki = await this.wikiModel.findAll({
      attributes: ['id', 'title'],
      where: {
        uid
      }
    })
    // 获取存储桶下的图片占比
    const bucket_res = await Promise.all(bucket.map(async (el) => {
      return {
        bucket_id: el.id,
        bucket_name: el.name,
        count: await this.imageModel.count({ where: { bucket_id: el.id, uid } })
      }
    }))
    // 获取存储桶下的容量占比
    const storage_res = await Promise.all(bucket.map(async (el) => {
      return {
        bucket_id: el.id,
        bucket_name: el.name,
        count: await this.imageModel.sum('size', { where: { bucket_id: el.id, uid } })
      }
    }))
    // 获取相册下的图片占比
    const album_res = await Promise.all(album.map(async (el) => {
      return {
        album_id: el.id,
        album_name: el.name,
        count: await this.imageModel.count({ where: { album_id: el.id, uid } })
      }
    }))
    // 获取知识库下的文章占比
    const wiki_res = await Promise.all(wiki.map(async (el) => {
      return {
        wiki_id: el.id,
        wiki_name: el.title,
        count: await this.articleModel.count({ where: { wid: el.id, uid } })
      }
    }))
    // 查询近一年12个月的数据统计数量
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置时间为今天的凌晨 0 点
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1); // 获取一年前的日期
    const year_image_res = await this.imageModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        uid,
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_album_res = await this.albumModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        uid,
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_bucket_res = await this.bucketModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        uid,
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_wiki_res = await this.wikiModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        uid,
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_article_res = await this.articleModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        uid,
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    return {
      bucket_image: bucket_res,
      bucket_storage: storage_res,
      album_image: album_res,
      wiki_article: wiki_res,
      stats: {
        image: year_image_res,
        album: year_album_res,
        bucket: year_bucket_res,
        wiki: year_wiki_res,
        article: year_article_res
      }
    }
  }

  /**
   * 获取占比数据
   * @param uid 
   * @returns 
   */
  async getAdminPercentData () {
    // 查询近一年12个月的数据统计数量
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置时间为今天的凌晨 0 点
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1); // 获取一年前的日期
    const year_image_res = await this.imageModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_album_res = await this.albumModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_bucket_res = await this.bucketModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_wiki_res = await this.wikiModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_article_res = await this.articleModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    const year_user_res = await this.userModel.findAll({
      attributes: [
        [
          this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'),
          'month',
        ],
        [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count'],
      ],
      where: {
        createdAt: {
          [Op.gte]: yearAgo,
          [Op.lt]: today,
        }
      },
      group: ['month'],
      order: [['month', 'ASC']],
    })
    return {
      stats: {
        image: year_image_res,
        album: year_album_res,
        bucket: year_bucket_res,
        wiki: year_wiki_res,
        article: year_article_res,
        user: year_user_res
      }
    }
  }
}
