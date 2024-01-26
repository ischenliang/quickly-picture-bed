import { Injectable } from '@nestjs/common';
import { CreateWikiDto, WikiFilter } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Wiki } from './entities/wiki.entity';
import { Article } from 'src/article/entities/article.entity';
import { Sequelize } from 'sequelize-typescript';
import sequelize from 'sequelize';
import { TimeService } from 'src/common/time.service';
import { Op } from 'sequelize';
import { GiteeService } from 'src/common/gitee.service';

@Injectable()
export class WikiService {

  constructor (
    @InjectModel(Wiki) private wikiModel: typeof Wiki,
    @InjectModel(Article) private articleModel: typeof Article,
    private timeService: TimeService,
    private sequelize: Sequelize,
    private readonly giteeService: GiteeService,
  ) {}

  /**
   * 创建知识库
   * @param createWikiDto 
   * @param uid 
   * @returns 
   */
  async create(createWikiDto: CreateWikiDto, uid: number) {
    // Todo: 还应当更新日志
    // 创建知识库的同时为知识库创建一个示例文章
    const { maxWeight } = await this.getMaxWeight()
    try {
      // 1、判断是否能否访问git
      const branchs: Array<any> = await this.giteeService.connectTest(createWikiDto.config)
      if (branchs.length) {
        let wiki: Wiki = null
        // 2、使用事务创建知识库和示例文章
        await this.sequelize.transaction(async transaction => {
          // 第一步：创建知识库
          wiki = await this.wikiModel.create({
            ...createWikiDto,
            uid,
            weight: maxWeight ? maxWeight + 1 : 1
          }, { transaction })
          // 第二步：创建文件并上传到关联的git上
          const filename = this.timeService.getTimeRandom() + '.md'
          const giteeData: any = await this.giteeService.createFile(filename, '示例文章内容...', createWikiDto.config)
          // 第三步：创建示例文章
          await this.articleModel.create({
            title: '示例文章',
            type: 'file',
            url: filename,
            public: false,
            theme: {
              code: 'github',
              markdown: 'github'
            },
            wid: wiki.id,
            uid,
            sha: giteeData.sha
          }, { transaction })
        })
        return wiki
      } else {
        return { statusCode: 500, data: 'Git仓库访问失败' }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: error
      }
    }
  }

  /**
   * 获取最大的weight值
   * @returns 
   */
  getMaxWeight (): Promise<any> {
    return this.wikiModel.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight'],
      ],
      raw: true
    })
  }

  /**
   * 查询列表
   * @param param 
   * @returns 
   */
  async findAll(param: WikiFilter, uid: number) {
    const { page, size, search, status } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['weight', 'desc']
      ],
      where: {
        uid: uid,
        title: {
          [Op.like]: search ? `%${search}%` : '%%'
        },
        description: {
          [Op.like]: search ? `%${search}%` : '%%'
        }
      }
    }
    if (Object.keys(param).includes('status')) {
      tmp.where.status = status
    }
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.wikiModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 知识库详情
   * @param id 
   * @param uid 
   * @returns 
   */
  findOne(id: number, uid: number) {
    return this.wikiModel.findOne({
      where: {
        id,
        uid
      }
    });
  }

  /**
   * 更新知识库
   * @param updateWikiDto 
   * @param uid 
   * @returns 
   */
  update(updateWikiDto: UpdateWikiDto, uid: number) {
    // Todo: 还应当更新日志
    return this.wikiModel.update({
      title: updateWikiDto.title,
      description: updateWikiDto.description,
      status: updateWikiDto.status
    }, {
      where: {
        id: updateWikiDto.id,
        uid
      }
    });
  }

  /**
   * 删除知识库同时删除文章
   * @param id 
   * @returns 
   */
  async remove(id: number, uid: number) {
    // Todo: 还应当更新日志和删除文章
    // 1、开启 Sequelize 事务
    const transaction = await this.sequelize.transaction();
    try {
      // 2、删除文章
      const fromItem = await this.articleModel.destroy({
        where: {
          wid: id,
          uid
        }
      })
      // 3、删除知识库
      const toItem = await this.wikiModel.destroy({
        where: {
          id,
          uid
        }
      });
      // 4、记录日志
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
   * 拖拽排序
   * @param from 
   * @param to 
   * @param uid 
   * @returns 
   */
  async sort (from: number, to: number, uid: number) {
    // 1、开始 Sequelize 事务
    const transaction = await this.sequelize.transaction()
    try {
      // 2、查询拖拽元素和被拖拽元素
      const fromItem = await this.wikiModel.findOne({
        where: {
          id: from,
          uid
        }
      })
      const toItem = await this.wikiModel.findOne({
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
   * 复制知识库(不会复制文章)
   * @param id 
   * @param uid 
   */
  async copy (id: number, name: string, uid: number) {
    const data = await this.wikiModel.findOne({
      where: {
        id,
        uid
      }
    })
    if (data && data.dataValues) {
      const { id, createdAt, updatedAt, ...param } = data.dataValues
      param.title = name || param.title + '(1)'
      return this.create(param as CreateWikiDto, uid)
    }
    return {
      statusCode: 500,
      data: '查询的知识库id并不存在'
    }
  }
}
