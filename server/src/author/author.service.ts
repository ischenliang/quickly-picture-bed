import { Injectable, Logger } from '@nestjs/common';
import { AuthorFilter, AuthorQuestionFilter, CreateAuthorDto, CreateAuthorQuestionDto } from './dto/create-author.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Op } from 'sequelize';
import { NotifyHistory } from './entities/notifyHistory';
import { ToolService } from 'src/tool/tool.service';
import { schedule_answer_cron, schedule_publisher_cron } from 'global.config';
import { Question } from 'src/question/entities/question.entity';
import sequelize from 'sequelize';
import { AuthorQuestion } from './entities/authorQuestion.entity';
import { NotifyReceiver } from './entities/notifyReceiver.entity';
import { CreateReceiverDto, ReceiverFilter } from './dto/create-receiver.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthorService {
  private readonly logger = new Logger(AuthorService.name)
  constructor (
    @InjectModel(Author) private authorModel: typeof Author,
    @InjectModel(NotifyHistory) private notifyHistoryModel: typeof NotifyHistory,
    @InjectModel(NotifyReceiver) private notifyReceiverModel: typeof NotifyReceiver,
    @InjectModel(Question) private questionModel: typeof Question,
    @InjectModel(AuthorQuestion) private authorQuestionModel: typeof AuthorQuestion,
    private scheduleRegistry: SchedulerRegistry,
    private readonly toolService: ToolService,
    private sequelize: Sequelize
  ) {}

  /**
   * 创建
   * @param createAuthorDto 
   * @param uid
   * @returns 
   */
  async create(createAuthorDto: CreateAuthorDto, uid: number) {
    // 这里的逻辑改下，直接爬虫爬取
    try {
      const { author_id, is_org, author_type } = createAuthorDto
      const { maxWeight } = await this.getMaxWeight(uid)
      const user = await this.toolService.getZhihuUserInfo(author_id, is_org)
      const data = await this.authorModel.create({
        author_id,
        is_org,
        author_name: user.name,
        author_avatar: user.avatarUrl,
        author_type: author_type,
        status: false,
        uid,
        weight: maxWeight ? maxWeight + 1 : 1
      })
      return data
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        data: error
      }
    }
  }


  /**
   * 获取最大排序值
   * @param uid 
   * @returns 
   */
  getMaxWeight (uid: number): Promise<any> {
    return this.authorModel.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight'],
      ],
      where: {
        uid: uid
      },
      raw: true
    })
  }

  /**
   * 查询列表
   * @param param 
   * @param uid 
   * @returns 
   */
  async findAll(param: AuthorFilter, uid: number) {
    const { page, size, search, author_type, is_org } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['weight', 'desc']
      ],
      where: {
        uid: uid,
        [Op.or]: {
          author_id: {
            [Op.like]: search ? `%${search}%` : '%%'
          },
          author_name: {
            [Op.like]: search ? `%${search}%` : '%%'
          },
          author_avatar: {
            [Op.like]: search ? `%${search}%` : '%%'
          }
        }
      }
    }
    if (author_type) {
      tmp.where.author_type = author_type
    }
    if (Object.keys(param).includes('is_org')) {
      tmp.where['is_org'] = is_org
    }
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.authorModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 详情
   * @param id 
   * @param uid 
   * @returns 
   */
  findOne(id: number, uid: number) {
    return this.authorModel.findOne({
      where: {
        id,
        uid
      }
    })
  }

  /**
   * 更新
   * @param id 
   * @param uid 
   * @returns 
   */
  async update(param: CreateAuthorDto, uid: number) {
    return this.authorModel.update({
      ...param
    }, {
      where: {
        id: param.id,
        uid
      }
    })
  }

  /**
   * 删除问题
   * @param id 
   * @param uid 
   * @returns 
   */
  async remove(id: number, uid: number) {
    const data = await this.authorModel.findOne({
      where: {
        id,
        uid
      }
    })
    if (data) {
      // 删除该博主的question详细数据
      await this.authorQuestionModel.destroy({
        where: {
          uid,
          aid: data.id
        }
      })
      this.stopNotify(data.author_id + `-${data.author_type}-` + data.id)
      this.deleteNotify(data.author_id + `-${data.author_type}-` + data.id)
    }
    return this.authorModel.destroy({
      where: {
        id,
        uid
      }
    });
  }

  /**
   * 创建作者问题
   * @param param 
   * @param aid 
   * @param uid 
   * @returns 
   */
  createQuestion (param: CreateAuthorQuestionDto, aid: number, uid: number) {
    return this.authorQuestionModel.create({
      ...param,
      aid,
      uid
    })
  }

  /**
   * 手动创建作者问题
   * @param param 
   * @param aid 
   * @param uid 
   * @returns 
   */
  async createQuestionByHand (param: CreateQuestionDto, uid: number) {
    const { question_id, author_id, type } = param
    try {
      const question = await this.toolService.getZhihuQuestionInfo(question_id)
      return this.createQuestion({
        question_id: question.id,
        question_title: question.title,
        question_desc: question.detail,
        type: type,
        question_created: question.created,
        question_updated: question.updated,
        question_type: question.questionType
      }, author_id, uid)
    } catch (error) {
      return {
        statusCode: 500,
        data: error
      }
    }
  }

  /**
   * 删除作者问题
   * @param param 
   * @param aid 
   * @param uid 
   * @returns 
   */
  removeQuestion (id: number, uid: number) {
    return this.authorQuestionModel.destroy({
      where: {
        id,
        uid
      }
    })
  }


  /**
   * 查询作者问题详情
   * @param question_id 
   * @param aid 
   * @param uid 
   * @returns 
   */
  findOneQuestion (question_id: string, aid: number, uid: number, type: 'publish' | 'follow' | 'answer') {
    return this.authorQuestionModel.findOne({
      where: {
        question_id: question_id,
        aid: aid,
        uid,
        type
      },
      raw: true
    })
  }

  /**
   * 更新作者问题详情
   * @param question_id 
   * @param aid 
   * @param uid 
   * @returns 
   */
  async updateQuestion (id: number, uid: number) {
    const detail = await this.authorQuestionModel.findOne({ where: { id, uid } })
    if (!detail) {
      return { statusCode: 500, data: '记录不存在' }
    }
    const question = await this.toolService.getZhihuQuestionInfo(detail.question_id)
    return this.authorQuestionModel.update({
      question_created: question.created,
      question_updated: question.updated
    }, {
      where: {
        id,
        uid
      }
    })
  }

  /**
   * 标记作者问题详情：主要是为了便于查看是否为红包问题
   * @param question_id 
   * @param aid 
   * @param uid 
   * @returns 
   */
  async markQuestion (id: number, uid: number) {
    const detail = await this.authorQuestionModel.findOne({ where: { id, uid } })
    if (!detail) {
      return { statusCode: 500, data: '记录不存在' }
    }
    const { content, title, count_down_value } = await this.toolService.getZhihuQuestionRedPacket(detail.question_id)
    if (count_down_value) {
      return this.authorQuestionModel.update({
        question_type: 'redpacket'
      }, {
        where: {
          id,
          uid
        }
      })
    }
    return {}
  }

  /**
   * 获取作者问题列表
   * @param author_id 
   * @param uid 
   * @returns 
   */
  async findAllQuestion (param: AuthorQuestionFilter, uid: number) {
    const { page, size, search, type, question_type, author_id } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['createdAt', 'desc']
      ],
      where: {
        uid: uid,
        aid: author_id,
        [Op.or]: {
          question_id: {
            [Op.like]: search ? `%${search}%` : '%%'
          },
          question_title: {
            [Op.like]: search ? `%${search}%` : '%%'
          },
          question_desc: {
            [Op.like]: search ? `%${search}%` : '%%'
          }
        }
      },
      include: [
        { model: Author }
      ]
    }
    if (type) {
      tmp.where.type = type
    }
    if (question_type) {
      tmp.where.question_type = question_type
    }
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.authorQuestionModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 创建邮件通知者
   * @param param 
   * @param aid 
   * @param uid 
   * @returns 
   */
  createReceiver (param: CreateReceiverDto, uid: number) {
    return this.notifyReceiverModel.create({
      ...param,
      uid
    })
  }

  /**
   * 更新邮件通知者
   * @param param 
   * @param aid 
   * @param uid 
   * @returns 
   */
  updateReceiver (param: CreateReceiverDto, uid: number) {
    return this.notifyReceiverModel.update({
      ...param
    }, {
      where: {
        uid,
        id: param.id
      }
    })
  }

  /**
   * 删除邮件通知者
   * @param param 
   * @param aid 
   * @param uid 
   * @returns 
   */
  removeReceiver (id: number, uid: number) {
    return this.notifyReceiverModel.destroy({
      where: {
        id,
        uid
      }
    })
  }

  /**
   * 获取作者问题列表
   * @param author_id 
   * @param uid 
   * @returns 
   */
  async findAllReceiver (param: ReceiverFilter, uid: number) {
    const { page, size, search, status } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['createdAt', 'desc']
      ],
      where: {
        uid: uid,
        [Op.or]: {
          email: {
            [Op.like]: search ? `%${search}%` : '%%'
          },
          remark: {
            [Op.like]: search ? `%${search}%` : '%%'
          }
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
    const { count, rows } = await this.notifyReceiverModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 开始通知：创建定时任务(题主)
   * @param time 
   * @param question_id 
   */
  startNotify (time: number, author: CreateAuthorDto, uid: number) {
    const { author_id, id } = author
    const interval = setInterval(async () => {
      this.logger.warn(`job ${author_id} execute one time!`)
      // 第一步：获取最新的作者信息
      const lastAuthor = await this.findOne(id, uid)
      try {
        // 第二步：获取该作者新添加的问题列表
        const questions = await this.toolService.getAuthorNewQuestions(lastAuthor.author_id, lastAuthor.is_org, 'publisher')
        if (questions && questions.length) {
          // 第四步：判断这些问题是否存在于作者问题列表中
          //    存在：则跳过
          //    不存在：如果是疑似红包问题则邮件通知，否则直接新增即可
          const notify_emails = await this.notifyReceiverModel.findAll({ where: { uid, status: true } })
          for (let i = 0; i < questions.length; i++) {
            const question = questions[i]
            const question_record = await this.findOneQuestion(question.id, lastAuthor.id, uid, question.type)
            if (!question_record) {
              // 新增问题
              const result = await this.toolService.getZhihuQuestionInfo(question.id)
              await this.createQuestion({
                question_id: result.id,
                question_title: result.title,
                question_desc: result.detail,
                question_type: result.questionType,
                type: question.type,
                question_created: result.created || '',
                question_updated: result.updated || ''
              }, lastAuthor.id, uid)
              // 判断是否为疑似红包：是 - 邮箱通知
              if (result.questionType === 'commercial') {
                await Promise.all(notify_emails.map(async (email) => {
                  const notify_content = `【${lastAuthor.author_name}】新添加了一个问题：${result.title}，<a href="https://www.zhihu.com/question/${result.id}" target="_blank">赶快前往去回答吧</a>，<a href="https://www.zhihu.com/oia/questions/${result.id}?open=1&utm_id=0&fallback_url=https://oia.zhihu.com/questions/${result.id}?utm_id=0" target="_blank">手机端打开</a>`
                  // 邮件通知完还需要更新通知记录
                  await this.notifyHistoryModel.create({
                    obj_id: lastAuthor.author_id,
                    notify_type: 'publisher',
                    notify_content: notify_content,
                    uid
                  })
                  this.toolService.sendZhihuMail(notify_content, email.email)
                }))
              }
            }
          }
        }
      } catch (error) {
        // 没有新增问题：继续定时任务
        console.log('报错啦', error)
      }
    }, time);
    this.scheduleRegistry.addInterval(author_id + '-publisher-' + id, interval)
    this.logger.warn(`job ${author_id + '-publisher-' + id} added!`)
  }

  /**
   * 开始通知：创建定时任务(答主)
   * @param time 
   * @param question_id 
   */
  startAnswerNotify (time: number, author: CreateAuthorDto, uid: number) {
    const { author_id, id } = author
    const interval = setInterval(async () => {
      this.logger.warn(`job ${author_id} execute one time!`)
      // 第一步：获取最新的作者消息
      const lastAuthor = await this.findOne(id, uid)
      try {
        // 第二步：获取该作者的动态中的问题
        const questions = await this.toolService.getAuthorNewQuestions(lastAuthor.author_id, lastAuthor.is_org, 'answer')
        if (questions && questions.length) {
          const notify_emails = await this.notifyReceiverModel.findAll({ where: { uid, status: true } })
          // 第四步：判断这些问题是否存在于作者问题关注列表中
          for (let i = 0; i < questions.length; i++) {
            const question = questions[i]
            const quesion_record = await this.findOneQuestion(question.id, lastAuthor.id, uid, question.type)
            if (!quesion_record) {
              const result = await this.toolService.getZhihuQuestionInfo(question.id)
              // 新增问题
              await this.createQuestion({
                question_id: result.id,
                question_title: result.title,
                question_desc: result.detail,
                question_type: result.questionType,
                type: question.type,
                question_created: result.created || '',
                question_updated: result.updated || ''
              }, lastAuthor.id, uid)
              // 判断是否为疑似红包：是 - 邮箱通知
              if (result.questionType === 'commercial') {
                await Promise.all(notify_emails.map(async (email) => {
                  const notify_content = `【${lastAuthor.author_name}】${question.type === 'follow' ? '新关注' : '新回答'}了一个问题：${result.title}，<a href="https://www.zhihu.com/question/${result.id}" target="_blank">赶快前往去回答吧</a>，<a href="https://www.zhihu.com/oia/questions/${result.id}?open=1&utm_id=0&fallback_url=https://oia.zhihu.com/questions/${result.id}?utm_id=0" target="_blank">手机端打开</a>`
                  // 邮件通知完还需要更新通知记录
                  await this.notifyHistoryModel.create({
                    obj_id: lastAuthor.author_id,
                    notify_type: 'answer',
                    notify_content: notify_content,
                    uid
                  })
                  this.toolService.sendZhihuMail(notify_content, email.email)
                }))
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }, time)
    this.scheduleRegistry.addInterval(author_id + '-answer-' + id, interval)
    this.logger.warn(`job ${author_id + '-answer-' + id} added!`)
  }

  /**
   * 暂停通知
   * @param task_id 
   */
  stopNotify (task_id: string) {
    // const jobs = this.scheduleRegistry.getCronJobs()
    // if (jobs.has(task_id)) {
    //   const job = this.scheduleRegistry.getCronJob(task_id)
    //   job && job.stop()
    //   this.logger.warn(`job ${task_id} stopped!`)
    // }

    const intervals = this.scheduleRegistry.getIntervals();
    if (intervals.some(el => el === task_id)) {
      this.scheduleRegistry.deleteInterval(task_id)
      this.logger.warn(`job ${task_id} stopped!`)
    }
  }

  /**
   * 删除通知
   * @param task_id 
   */
  deleteNotify (task_id: string) {
    // const jobs = this.scheduleRegistry.getCronJobs()
    // if (jobs.has(task_id)) {
    //   const job = this.scheduleRegistry.getCronJob(task_id)
    //   job && this.scheduleRegistry.deleteCronJob(task_id)
    //   this.logger.warn(`job ${task_id} deleted!`)
    // }

    const intervals = this.scheduleRegistry.getIntervals();
    if (intervals.some(el => el === task_id)) {
      this.scheduleRegistry.deleteInterval(task_id)
      this.logger.warn(`job ${task_id} deleted!`)
    }
  }



  /**
   * 关切换定时任务
   * @param ids 
   * @param uid 
   * @returns 
   */
  async toggleSchedule (id: number, uid) {
    const author = await this.findOne(id, uid)
    if (author.status) {
      this.stopNotify(author.author_id + `-${author.author_type}-` + author.id)
      this.deleteNotify(author.author_id + `-${author.author_type}-` + author.id)
    } else {
      if (author.author_type === 'answer') {
        this.startAnswerNotify(schedule_answer_cron, author, uid)
      } else {
        this.startNotify(schedule_publisher_cron, author, uid)
      }
    }
    return this.authorModel.update({
      status: !author.status
    }, {
      where: {
        id,
        uid
      }
    })
  }
  
  /**
   * 排序：上移或下移
   * @param id 
   * @param direction 
   * @param uid 
   * @returns 
   */
  async sort (id: number, direction: 'up' | 'down', author_type: 'publisher' | 'answer', uid) {
    const item = await this.findOne(id, uid)
    try {
      if (!item) {
        return { statusCode: 500, data: '数据不存在' }
      }
      switch (direction) {
        case 'up':
          const prevItem = await this.authorModel.findOne({
            where: {
              weight: {
                [Op.gt]: item.weight
              },
              uid,
              author_type
            },
            order: [
              ['weight', 'asc']
            ]
          })
          // 已经是第一个元素(weight值最大)，无法上移
          if (!prevItem) {
            return
          }
          await this.sequelize.transaction(async (t) => {
            await this.authorModel.update({ weight: prevItem.weight }, { where: { id: item.id, uid }, transaction: t })
            await this.authorModel.update({ weight: item.weight }, { where: { id: prevItem.id, uid }, transaction: t })
          })
          return item
        case 'down':
          const nextItem = await this.authorModel.findOne({
            where: {
              weight: {
                [Op.lt]: item.weight
              },
              uid,
              author_type
            },
            order: [
              ['weight', 'desc']
            ]
          })
          // 已经是第最后一个元素(weight值最小)，无法下移
          if (!nextItem) {
            return
          }
          await this.sequelize.transaction(async (t) => {
            await this.authorModel.update({ weight: nextItem.weight }, { where: { id: item.id, uid }, transaction: t })
            await this.authorModel.update({ weight: item.weight }, { where: { id: nextItem.id, uid }, transaction: t })
          })
          return item
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: error
      }
    }
  }

  /**
   * 数据统计
   * @param uid 
   * @returns 
   */
  async getStats (uid: number) {
    const question = {
      total: await this.questionModel.count({
        where: {
          uid
        }
      }),
      schedule: await this.questionModel.count({
        where: {
          uid,
          status: true
        }
      })
    }
    const answer = {
      total: await this.authorModel.count({
        where: {
          uid,
          author_type: 'answer'
        }
      }),
      schedule: await this.authorModel.count({
        where: {
          uid,
          author_type: 'answer',
          status: true
        }
      })
    }
    const publisher = {
      total: await this.authorModel.count({
        where: {
          uid,
          author_type: 'publisher'
        }
      }),
      schedule: await this.authorModel.count({
        where: {
          uid,
          author_type: 'publisher',
          status: true
        }
      })
    }
    const receiver = {
      total: await this.notifyReceiverModel.count({
        where: {
          uid
        }
      }),
      schedule: await this.notifyReceiverModel.count({
        where: {
          uid,
          status: true
        }
      })
    }
    return {
      question,
      answer,
      publisher,
      receiver
    }
  }
}
