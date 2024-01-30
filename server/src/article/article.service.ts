import { Injectable } from '@nestjs/common';
import { ArticleFilter, ChangeTheme, CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './entities/article.entity';
import { WikiService } from 'src/wiki/wiki.service';
import { TimeService } from 'src/common/time.service';
import sequelize from 'sequelize';
import { GiteeService, WikiConfig } from 'src/common/gitee.service';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Wiki } from 'src/wiki/entities/wiki.entity';

@Injectable()
export class ArticleService {

  constructor (
    @InjectModel(Article) private articleModel: typeof Article,
    private readonly wikiService: WikiService,
    private readonly timeService: TimeService,
    private readonly giteeService: GiteeService,
    private sequelize: Sequelize
  ) {}

  /**
   * 创建文章
   * @param createArticleDto 
   * @returns 
   */
  async create(createArticleDto: CreateArticleDto, uid: number) {
    const { wid, pid, markdown } = createArticleDto
    const { maxWeight } = await this.getMaxWeight(wid, pid)
    const wiki = await this.wikiService.findOne(wid, uid)
    if (wiki) {
      // Todo: 这里还需要记录日志
      try {
        createArticleDto.pid = pid === 0 ? null : pid
        const filename = this.timeService.getTimeRandom() + '.md'
        const giteeData: any = await this.giteeService.createFile(filename, markdown, wiki.config as WikiConfig)
        return this.articleModel.create({
          ...createArticleDto,
          url: filename,
          uid,
          sha: giteeData.sha,
          weight: maxWeight ? maxWeight + 1 : 1
        })
      } catch (error) {
        return {
          statusCode: 500,
          data: error
        }
      }
    }
    return {
      statusCode: 500,
      data: '知识库id不存在'
    }
  }

  /**
   * 查询文章列表
   * @param param 
   * @returns 
   */
  async pageTree(param: ArticleFilter, uid: number) {
    return this.recursionTreeData(param.wid, null, uid)
  }

  /**
   * 递归查询数据
   *  1、查询第一层数据：即pid为null的所有记录
   *  2、递归第一层数据，查询其子节点数据，以此类推
   * @param wid 
   * @param pid 
   * @returns 
   */
  async recursionTreeData (wid: number, pid: number, uid: number) {
    const articles = await this.articleModel.findAll({
      where: {
        wid: wid,
        pid: pid,
        uid
      },
      attributes: ['id', 'pid', 'public', 'title', 'type', 'wid', 'url', 'weight'],
      order: [['weight', 'desc']]
    })
    const treeData: Article[] = []
    for (let article of articles) {
      const children = await this.recursionTreeData(wid, article.id, uid)
      if (children.length) {
        article.dataValues.children = children
      }
      treeData.push(article)
    }
    return treeData
  }

  /**
   * 获取最大的weight值
   * @returns 
   */
  getMaxWeight (wid: number, pid: number): Promise<any> {
    return this.articleModel.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight'],
      ],
      where: {
        wid: wid,
        pid: pid ? pid : null
      },
      raw: true
    })
  }

  /**
   * 文档详情
   * @param id 
   * @param uid 
   * @returns 
   */
  async findOne(id: number, uid: number) {
    const data = await this.articleModel.findOne({
      where: {
        id,
        uid
      },
      raw: true
    });
    if (data) {
      const wiki = await this.wikiService.findOne(data.wid, uid)
      try {
        const markdown = (await this.giteeService.getFile(data.url, wiki.config as WikiConfig)) as string
        return {
          ...data,
          markdown: markdown ? Buffer.from(markdown, 'base64').toString('utf-8') : ' '
        }
      } catch (error) {
        return {
          statusCode: 500,
          data: error
        }
      }
    }
    return {
      statusCode: 500,
      data: '文档不存在'
    }
  }

  /**
   * 更新文档
   * @param updateArticleDto 
   * @param uid 
   * @returns 
   */
  async update(updateArticleDto: UpdateArticleDto, uid: number) {
    const { id, title, markdown } = updateArticleDto
    const article = await this.articleModel.findOne({
      where: {
        id,
        uid
      },
      raw: true
    })
    if (article) {
      try {
        const wiki = await this.wikiService.findOne(article.wid, uid)
        const giteeData: any = await this.giteeService.updateFile(article.url, markdown, article.sha, wiki.config as WikiConfig)
        return this.articleModel.update({
          title: title,
          sha: giteeData.sha
        }, {
          where: {
            id: id,
            uid
          }
        })
      } catch (error) {
        return {
          statusCode: 500,
          data: error
        }
      }
    }
    return {
      statusCode: 500,
      data: '文档不存在'
    }
  }

  /**
   * 递归删除节点
   * @param id 
   * @param uid 
   * @returns 
   */
  async recursionRemoveData (id: number, uid: number, config: WikiConfig) {
    // 查询当前节点的所有子节点
    const children = await this.articleModel.findAll({
      where: {
        pid: id
      }
    })
    // 递归删除所有子节点的子节点
    for (const child of children) {
      // 删除文件
      await this.giteeService.deleteFile(child.url, child.sha, config)
      // 删除数据库记录
      await this.recursionRemoveData(child.id, uid, config);
    }
    return await this.articleModel.destroy({
      where: {
        id: id
      }
    })
  }

  /**
   * 删除文档: 需要关联删除
   * @param id 
   * @param uid 
   * @returns 
   */
  async remove(id: number, uid: number) {
    const article = await this.articleModel.findOne({
      where: {
        id,
        uid
      },
      raw: true
    })
    if (article) {
      try {
        const wiki = await this.wikiService.findOne(article.wid, uid)
        // 删除文件
        await this.giteeService.deleteFile(article.url, article.sha, wiki.config as WikiConfig)
        return this.recursionRemoveData(article.id, uid, wiki.config as WikiConfig)
      } catch (error) {
        return {
          statusCode: 500,
          data: error
        }
      }
    }
    return { statusCode: 500, data: '文档不存在' }
  }

  /**
   * 复制文档
   * @param id 
   * @param uid 
   * @returns 
   */
  async copy (id: number, uid: number) {
    const { id: articleId, ...options } = await this.articleModel.findOne({
      where: {
        id,
        uid
      },
      raw: true
    })

    if (articleId && options) {
      try {
        const wiki = await this.wikiService.findOne(options.wid, uid)
        const markdown = await this.giteeService.getFile(options.url, wiki.config as WikiConfig) as string
        return this.create({
          ...options,
          title: options.title + '(1)',
          markdown: Buffer.from(markdown, 'base64').toString('utf-8') || ' '
        }, uid)
      } catch (error) {
        return {
          statusCode: 500,
          data: error
        }
      }
    }
    return { statusCode: 500, data: '文档不存在' }
  }

  /**
   * 排序
   * @param from 
   * @param to 
   * @param uid 
   */
  async sort (from: number, to: number, uid: number, type: string) {
    // 1、开始 Sequelize 事务
    const transaction = await this.sequelize.transaction()
    try {
      // 2、查询拖拽元素和被拖拽元素
      const fromItem = await this.articleModel.findOne({
        where: {
          id: from,
          uid
        }
      })
      const toItem = await this.articleModel.findOne({
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
      switch(type) {
        case 'before':
          // 前移：
          // 3.1、to以及to以后的元素weight = weight - 1
          // 3.2、from元素占用to元素的weight
          // 3.3、将fromItem的pid设置为toItem的pid
          await this.articleModel.update({
            weight: Sequelize.literal('weight - 1')
          }, {
            where: {
              wid: toItem.wid,
              weight: {
                [Op.lte]: toItem.weight
              },
              pid: toItem.pid
            },
            transaction
          })
          await this.articleModel.update({
            weight: toWeight,
            pid: toItem.pid
          }, {
            where: {
              id: fromItem.id
            },
            transaction
          })
          break
        case 'inner':
          // 插入
          // 3.1、获取toItem的子节点的最大maxWeight值
          // 3.2、将fromItem的weight = maxWeight + 1
          // 3.3、将fromItem的pid设置为toItem的id
          const { maxWeight } = await this.getMaxWeight(toItem.wid, toItem.id)
          await this.articleModel.update({
            weight: maxWeight ? maxWeight + 1 : 1,
            pid: toItem.id
          }, {
            where: {
              id: fromItem.id
            },
            transaction
          })
          break
        case 'after':
          // 后移
          // 3.1、from和to之间的元素(包含to不包含from)的weight = weight - 1
          // 3.2、from元素占用to元素的weight
          // 3.3、将fromIten的pid设置为toItem的pid
          await this.articleModel.update({
            weight: Sequelize.literal('weight + 1'),
            pid: toItem.pid
          }, {
            where: {
              wid: toItem.wid,
              weight: {
                [Op.and]: {
                  [Op.gt]: fromWeight,
                  [Op.lte]: toWeight
                }
              }
            },
            transaction
          })
          await this.articleModel.update({
            weight: toWeight,
            pid: toItem.pid
          }, {
            where: {
              id: fromItem.id
            },
            transaction
          })
          break
      }
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
   * 发布文章: 有缺陷，如果父节点未发布时该如何处理
   * @param id 
   * @param uid 
   * @returns 
   */
  publish (id: number, uid: number) {
    // Todo: 缺陷
    const publishedAt = this.timeService.getCurrentTime()
    return this.articleModel.update({
      publishedAt: publishedAt
    }, {
      where: {
        id,
        uid
      }
    })
  }

  /**
   * 切换主题
   * @param param 
   * @param uid 
   * @returns 
   */
  theme (param: ChangeTheme, uid: number) {
    return this.articleModel.update({
      theme: param.theme
    }, {
      where: {
        id: param.id,
        uid
      }
    })
  }
}
