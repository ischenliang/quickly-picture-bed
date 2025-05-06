import { Injectable, Logger } from '@nestjs/common';
import {
  AuthorFilter,
  AuthorQuestionFilter,
  CreateAuthorDto,
  CreateAuthorQuestionDto,
} from './dto/create-author.dto';
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
  private readonly logger = new Logger(AuthorService.name);
  constructor(
    @InjectModel(Author) private authorModel: typeof Author,
    @InjectModel(NotifyHistory)
    private notifyHistoryModel: typeof NotifyHistory,
    @InjectModel(NotifyReceiver)
    private notifyReceiverModel: typeof NotifyReceiver,
    @InjectModel(Question) private questionModel: typeof Question,
    @InjectModel(AuthorQuestion)
    private authorQuestionModel: typeof AuthorQuestion,
    private scheduleRegistry: SchedulerRegistry,
    private readonly toolService: ToolService,
    private sequelize: Sequelize,
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
      const { author_id, is_org, author_type } = createAuthorDto;
      const { maxWeight } = await this.getMaxWeight(uid);
      const user = await this.toolService.getZhihuUserInfo(author_id, is_org);
      const data = await this.authorModel.create({
        author_id,
        is_org,
        author_name: user.name,
        author_avatar: user.avatarUrl,
        author_type: author_type,
        status: 0,
        uid,
        weight: maxWeight ? maxWeight + 1 : 1,
      });
      return data;
    } catch (error) {
      return {
        statusCode: 500,
        data: error,
      };
    }
  }

  /**
   * 获取最大排序值
   * @param uid
   * @returns
   */
  getMaxWeight(uid: number): Promise<any> {
    return this.authorModel.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight']],
      where: {
        uid: uid,
      },
      raw: true,
    });
  }

  /**
   * 查询列表
   * @param param
   * @param uid
   * @returns
   */
  async findAll(param: AuthorFilter, uid: number) {
    const { page, size, search, author_type } = param;
    const data: any = {};
    const tmp: any = {
      order: [['weight', 'desc']],
      where: {
        uid: uid,
        [Op.or]: {
          author_id: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          author_name: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          author_avatar: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
        },
      },
    };
    if (author_type) {
      tmp.where.author_type = author_type;
    }
    if (page) {
      tmp.limit = size || 10;
      tmp.offset = page ? (page - 1) * size : 0;
    }
    const { count, rows } = await this.authorModel.findAndCountAll(tmp);
    data.total = count;
    data.items = rows;
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
        uid,
      },
    });
  }

  /**
   * 更新
   * @param id
   * @param uid
   * @returns
   */
  async update(param: CreateAuthorDto, uid: number) {
    return this.authorModel.update(
      {
        ...param,
      },
      {
        where: {
          id: param.id,
          uid,
        },
      },
    );
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
        uid,
      },
    });
    if (data) {
      // 删除该博主的question详细数据
      await this.authorQuestionModel.destroy({
        where: {
          uid,
          aid: data.id,
        },
      });
      this.stopNotify(data.author_id + `-${data.author_type}-` + data.id);
      this.deleteNotify(data.author_id + `-${data.author_type}-` + data.id);
    }
    return this.authorModel.destroy({
      where: {
        id,
        uid,
      },
    });
  }

  /**
   * 创建作者问题
   * @param param
   * @param aid
   * @param uid
   * @returns
   */
  createQuestion(param: CreateAuthorQuestionDto, aid: number, uid: number) {
    return this.authorQuestionModel.create({
      ...param,
      aid,
      uid,
    });
  }

  /**
   * 手动创建作者问题
   * @param param
   * @param aid
   * @param uid
   * @returns
   */
  async createQuestionByHand(param: CreateQuestionDto, uid: number) {
    const { question_id, author_id, type } = param;
    try {
      const question = await this.toolService.getZhihuQuestionInfo(question_id);
      return this.createQuestion(
        {
          question_id: question.id,
          question_title: question.title,
          question_desc: question.detail,
          type: type,
          question_created: question.created,
          question_updated: question.updated,
          question_type: question.questionType,
        },
        author_id,
        uid,
      );
    } catch (error) {
      return {
        statusCode: 500,
        data: error,
      };
    }
  }

  /**
   * 删除作者问题
   * @param param
   * @param aid
   * @param uid
   * @returns
   */
  removeQuestion(id: number, uid: number) {
    return this.authorQuestionModel.destroy({
      where: {
        id,
        uid,
      },
    });
  }

  /**
   * 查询作者问题详情
   * @param question_id
   * @param aid
   * @param uid
   * @returns
   */
  findOneQuestion(
    question_id: number,
    aid: number,
    uid: number,
    type: 'publish' | 'follow' | 'answer',
  ) {
    return this.authorQuestionModel.findOne({
      where: {
        question_id,
        aid,
        uid,
        type,
      },
    });
  }

  /**
   * 更新作者问题详情
   * @param question_id
   * @param aid
   * @param uid
   * @returns
   */
  async updateQuestion(id: number, uid: number) {
    const detail = await this.authorQuestionModel.findOne({
      where: { id, uid },
    });
    if (!detail) {
      return { statusCode: 500, data: '记录不存在' };
    }
    const question = await this.toolService.getZhihuQuestionInfo(
      detail.question_id,
    );
    return this.authorQuestionModel.update(
      {
        question_created: question.created,
        question_updated: question.updated,
      },
      {
        where: {
          id,
          uid,
        },
      },
    );
  }

  /**
   * 标记作者问题详情：主要是为了便于查看是否为红包问题
   * @param question_id
   * @param aid
   * @param uid
   * @returns
   */
  async markQuestion(id: number, uid: number) {
    const detail = await this.authorQuestionModel.findOne({
      where: { id, uid },
    });
    if (!detail) {
      return { statusCode: 500, data: '记录不存在' };
    }
    const { content, title, count_down_value } =
      await this.toolService.getZhihuQuestionRedPacket(detail.question_id);
    if (count_down_value) {
      return this.authorQuestionModel.update(
        {
          question_type: 'redpacket',
        },
        {
          where: {
            id,
            uid,
          },
        },
      );
    }
    return {};
  }

  /**
   * 获取作者问题列表
   * @param author_id
   * @param uid
   * @returns
   */
  async findAllQuestion(param: AuthorQuestionFilter, uid: number) {
    const { page, size, search, type, question_type, author_id } = param;
    const data: any = {};
    const tmp: any = {
      order: [['createdAt', 'desc']],
      where: {
        uid: uid,
        aid: author_id,
        [Op.or]: {
          question_id: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          question_title: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          question_desc: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
        },
      },
      include: [{ model: Author }],
    };
    if (type) {
      tmp.where.type = type;
    }
    if (question_type) {
      tmp.where.question_type = question_type;
    }
    if (page) {
      tmp.limit = size || 10;
      tmp.offset = page ? (page - 1) * size : 0;
    }
    const { count, rows } = await this.authorQuestionModel.findAndCountAll(tmp);
    data.total = count;
    data.items = rows;
    return data;
  }

  /**
   * 创建邮件通知者
   * @param param
   * @param aid
   * @param uid
   * @returns
   */
  createReceiver(param: CreateReceiverDto, uid: number) {
    return this.notifyReceiverModel.create({
      ...param,
      uid,
    });
  }

  /**
   * 更新邮件通知者
   * @param param
   * @param aid
   * @param uid
   * @returns
   */
  updateReceiver(param: CreateReceiverDto, uid: number) {
    return this.notifyReceiverModel.update(
      {
        ...param,
      },
      {
        where: {
          uid,
          id: param.id,
        },
      },
    );
  }

  /**
   * 删除邮件通知者
   * @param param
   * @param aid
   * @param uid
   * @returns
   */
  removeReceiver(id: number, uid: number) {
    return this.notifyReceiverModel.destroy({
      where: {
        id,
        uid,
      },
    });
  }

  /**
   * 获取作者问题列表
   * @param author_id
   * @param uid
   * @returns
   */
  async findAllReceiver(param: ReceiverFilter, uid: number) {
    const { page, size, search, status } = param;
    const data: any = {};
    const tmp: any = {
      order: [['createdAt', 'desc']],
      where: {
        uid: uid,
        [Op.or]: {
          email: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          remark: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
        },
      },
    };
    if (Object.keys(param).includes('status')) {
      tmp.where.status = status;
    }
    if (page) {
      tmp.limit = size || 10;
      tmp.offset = page ? (page - 1) * size : 0;
    }
    const { count, rows } = await this.notifyReceiverModel.findAndCountAll(tmp);
    data.total = count;
    data.items = rows;
    return data;
  }

  /**
   * 开始通知：创建定时任务
   * @param time
   * @param question_id
   */
  startNotify(time: string, author: CreateAuthorDto, uid: number) {
    const { author_id, id } = author;
    const job = new CronJob(time, async () => {
      this.logger.warn(`job ${author_id} execute one time!`);
      // 第一步：获取最新的作者信息
      const lastAuthor = await this.findOne(id, uid);
      try {
        // 第二步：获取该作者的动态
        const { questions: questionObj } =
          await this.toolService.getZhihuUserQuestionsAndAnswers(
            lastAuthor.author_id,
            lastAuthor.is_org,
          );
        // 第三步：获取问题详情(题主发布的问题) ==> 为了获取第二步无法获取创建时间和修改时间以及筛选出只是自己的问题
        // 这里会导致发送多个请求：容易被判定为人机
        // const questions_info = (await Promise.all(Object.keys(questionObj).map(id => this.toolService.getZhihuQuestionInfo(id)))).filter(question => question.author.id === lastAuthor.author_id)
        const questions_info = Object.keys(questionObj)
          .map((id) => questionObj[id])
          .filter(
            (question) => question.author.urlToken === lastAuthor.author_id,
          );
        // 第四步：判断这些问题是否存在于作者问题列表中
        //    存在：则跳过
        //    不存在：如果是疑似红包问题则邮件通知，否则直接新增即可
        for (let i = 0; i < questions_info.length; i++) {
          const question = questions_info[i];
          const author_question = await this.findOneQuestion(
            question.id,
            lastAuthor.id,
            uid,
            'publish',
          );
          const notify_emails = await this.notifyReceiverModel.findAll({
            where: { uid, status: 1 },
          });
          if (!author_question) {
            // 新增问题
            await this.createQuestion(
              {
                question_id: question.id,
                question_title: question.title,
                question_desc: question.detail,
                question_type: question.questionType,
                type: 'publish',
                question_created: question.created || '',
                question_updated: question.updated || '',
              },
              lastAuthor.id,
              uid,
            );
            // 判断是否为疑似红包：是 - 邮箱通知
            if (question.questionType === 'commercial') {
              await Promise.all(
                notify_emails.map(async (email) => {
                  const notify_content = `【${lastAuthor.author_name}】新添加了一个问题：${question.title}，<a href="https://www.zhihu.com/question/${question.id}" target="_blank">赶快前往去回答吧</a>`;
                  // 邮件通知完还需要更新通知记录
                  await this.notifyHistoryModel.create({
                    obj_id: lastAuthor.author_id,
                    notify_type: 'publisher',
                    notify_content: notify_content,
                    uid,
                  });
                  return this.toolService.sendZhihuMail(
                    notify_content,
                    email.email,
                  );
                }),
              );
            }
          }
        }
      } catch (error) {
        // 没有新增问题：继续定时任务
        console.log(error);
      }
    });
    this.scheduleRegistry.addCronJob(author_id + '-publisher-' + id, job);
    job.start();
    this.logger.warn(`job ${author_id + '-publisher-' + id} added!`);
  }

  /**
   * 开始通知：创建定时任务
   * @param time
   * @param question_id
   */
  startAnswerNotify(time: string, author: CreateAuthorDto, uid: number) {
    const { author_id, id } = author;
    const job = new CronJob(time, async () => {
      this.logger.warn(`job ${author_id} execute one time!`);
      // 第一步：获取最新的作者消息
      const lastAuthor = await this.findOne(id, uid);
      try {
        // 第二步：获取该作者的动态中的问题
        const { questions: questionObj, answers: answersObj } =
          await this.toolService.getZhihuUserQuestionsAndAnswers(
            lastAuthor.author_id,
            lastAuthor.is_org,
          );
        // 第三步：获取问题详情(答主关注的问题) ==> 为了获取第二步无法获取创建时间和修改时间以及筛选出非自己的问题(即关注的问题)
        // const questions_info = (await Promise.all(Object.keys(questionObj).map(id => this.toolService.getZhihuQuestionInfo(id)))).filter(question => question.author.id !== lastAuthor.author_id)
        const questions_info = Object.keys(questionObj)
          .map((id) => questionObj[id])
          .filter(
            (question) => question.author.urlToken !== lastAuthor.author_id,
          );
        const notify_emails = await this.notifyReceiverModel.findAll({
          where: { uid, status: 1 },
        });
        // 第四步：判断这些问题是否存在于作者问题关注列表中
        for (let i = 0; i < questions_info.length; i++) {
          const question = questions_info[i];
          const author_question = await this.findOneQuestion(
            question.id,
            lastAuthor.id,
            uid,
            'follow',
          );
          if (!author_question) {
            // 新增问题
            await this.createQuestion(
              {
                question_id: question.id,
                question_title: question.title,
                question_desc: question.detail,
                question_type: question.questionType,
                type: 'follow',
                question_created: question.created || '',
                question_updated: question.updated || '',
              },
              lastAuthor.id,
              uid,
            );
            // 判断是否为疑似红包：是 - 邮箱通知
            if (question.questionType === 'commercial') {
              await Promise.all(
                notify_emails.map(async (email) => {
                  const notify_content = `【${lastAuthor.author_name}】新关注了一个问题：${question.title}，<a href="https://www.zhihu.com/question/${question.id}" target="_blank">赶快前往去回答吧</a>`;
                  // 邮件通知完还需要更新通知记录
                  await this.notifyHistoryModel.create({
                    obj_id: lastAuthor.author_id,
                    notify_type: 'answer',
                    notify_content: notify_content,
                    uid,
                  });
                  return this.toolService.sendZhihuMail(
                    notify_content,
                    email.email,
                  );
                }),
              );
            }
          }
        }
        // 第五步：获取问题详情(答主回答的问题) ==> 为了获取第二步无法获取创建时间和修改时间以及筛选出自己回答的问题
        // 查询只属该作者的回答
        const author_answer = Object.keys(answersObj).filter(
          (id) => answersObj[id].author.urlToken === lastAuthor.author_id,
        );
        // const answers_info = (await Promise.all(author_answer.map(id => this.toolService.getZhihuQuestionInfo(answersObj[id].question.id))))
        const answers_info = author_answer.map((id) => answersObj[id].question);
        // 第六步：判断这些问题是否存在于作者问题列表中
        for (let i = 0; i < answers_info.length; i++) {
          const question = answers_info[i];
          const author_question = await this.findOneQuestion(
            question.id,
            lastAuthor.id,
            uid,
            'answer',
          );
          if (!author_question) {
            // 新增问题
            await this.createQuestion(
              {
                question_id: question.id,
                question_title: question.title,
                question_desc: question.detail,
                question_type: question.questionType,
                type: 'answer',
                question_created: question.created || '',
                question_updated: question.updated || '',
              },
              lastAuthor.id,
              uid,
            );
            // 判断是否为疑似红包：是 - 邮箱通知
            if (question.questionType === 'commercial') {
              await Promise.all(
                notify_emails.map(async (email) => {
                  const notify_content = `【${lastAuthor.author_name}】新回答了一个问题：${question.title}，<a href="https://www.zhihu.com/question/${question.id}" target="_blank">赶快前往去回答吧</a>`;
                  // 邮件通知完还需要更新通知记录
                  await this.notifyHistoryModel.create({
                    obj_id: lastAuthor.author_id,
                    notify_type: 'answer',
                    notify_content: notify_content,
                    uid,
                  });
                  return this.toolService.sendZhihuMail(
                    notify_content,
                    email.email,
                  );
                }),
              );
              // 邮件通知完还需要更新通知记录
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    this.scheduleRegistry.addCronJob(author_id + '-answer-' + id, job);
    job.start();
    this.logger.warn(`job ${author_id + '-answer-' + id} added!`);
  }

  /**
   * 暂停通知
   * @param task_id
   */
  stopNotify(task_id: string) {
    const jobs = this.scheduleRegistry.getCronJobs();
    if (jobs.has(task_id)) {
      const job = this.scheduleRegistry.getCronJob(task_id);
      job && job.stop();
      this.logger.warn(`job ${task_id} stopped!`);
    }
  }

  /**
   * 删除通知
   * @param task_id
   */
  deleteNotify(task_id: string) {
    const jobs = this.scheduleRegistry.getCronJobs();
    if (jobs.has(task_id)) {
      const job = this.scheduleRegistry.getCronJob(task_id);
      job && this.scheduleRegistry.deleteCronJob(task_id);
      this.logger.warn(`job ${task_id} deleted!`);
    }
  }

  /**
   * 关切换定时任务
   * @param ids
   * @param uid
   * @returns
   */
  async toggleSchedule(id: number, uid) {
    const author = await this.findOne(id, uid);
    if (author.status) {
      this.stopNotify(author.author_id + `-${author.author_type}-` + author.id);
      this.deleteNotify(
        author.author_id + `-${author.author_type}-` + author.id,
      );
    } else {
      if (author.author_type === 'answer') {
        this.startAnswerNotify(
          schedule_answer_cron.replace(
            /second/g,
            new Date().getSeconds().toString(),
          ),
          author,
          uid,
        );
      } else {
        this.startNotify(
          schedule_publisher_cron.replace(
            /second/g,
            new Date().getSeconds().toString(),
          ),
          author,
          uid,
        );
      }
    }
    return this.authorModel.update(
      {
        status: author.status == 0 ? 1 : 0,
      },
      {
        where: {
          id,
          uid,
        },
      },
    );
  }

  /**
   * 排序：上移或下移
   * @param id
   * @param direction
   * @param uid
   * @returns
   */
  async sort(
    id: number,
    direction: 'up' | 'down',
    author_type: 'publisher' | 'answer',
    uid,
  ) {
    const item = await this.findOne(id, uid);
    try {
      if (!item) {
        return { statusCode: 500, data: '数据不存在' };
      }
      switch (direction) {
        case 'up':
          const prevItem = await this.authorModel.findOne({
            where: {
              weight: {
                [Op.gt]: item.weight,
              },
              uid,
              author_type,
            },
            order: [['weight', 'asc']],
          });
          // 已经是第一个元素(weight值最大)，无法上移
          if (!prevItem) {
            return;
          }
          await this.sequelize.transaction(async (t) => {
            await this.authorModel.update(
              { weight: prevItem.weight },
              { where: { id: item.id, uid }, transaction: t },
            );
            await this.authorModel.update(
              { weight: item.weight },
              { where: { id: prevItem.id, uid }, transaction: t },
            );
          });
          return item;
        case 'down':
          const nextItem = await this.authorModel.findOne({
            where: {
              weight: {
                [Op.lt]: item.weight,
              },
              uid,
              author_type,
            },
            order: [['weight', 'desc']],
          });
          // 已经是第最后一个元素(weight值最小)，无法下移
          if (!nextItem) {
            return;
          }
          await this.sequelize.transaction(async (t) => {
            await this.authorModel.update(
              { weight: nextItem.weight },
              { where: { id: item.id, uid }, transaction: t },
            );
            await this.authorModel.update(
              { weight: item.weight },
              { where: { id: nextItem.id, uid }, transaction: t },
            );
          });
          return item;
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: error,
      };
    }
  }

  /**
   * 数据统计
   * @param uid
   * @returns
   */
  async getStats(uid: number) {
    const question = {
      total: await this.questionModel.count({
        where: {
          uid,
        },
      }),
      schedule: await this.questionModel.count({
        where: {
          uid,
          status: 1,
        },
      }),
    };
    const answer = {
      total: await this.authorModel.count({
        where: {
          uid,
          author_type: 'answer',
        },
      }),
      schedule: await this.authorModel.count({
        where: {
          uid,
          author_type: 'answer',
          status: 1,
        },
      }),
    };
    const publisher = {
      total: await this.authorModel.count({
        where: {
          uid,
          author_type: 'publisher',
        },
      }),
      schedule: await this.authorModel.count({
        where: {
          uid,
          author_type: 'publisher',
          status: 1,
        },
      }),
    };
    const receiver = {
      total: await this.notifyReceiverModel.count({
        where: {
          uid,
        },
      }),
      schedule: await this.notifyReceiverModel.count({
        where: {
          uid,
          status: 1,
        },
      }),
    };
    return {
      question,
      answer,
      publisher,
      receiver,
    };
  }
}
