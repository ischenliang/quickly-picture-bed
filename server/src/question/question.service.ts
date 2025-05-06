import { Injectable, Logger } from '@nestjs/common';
import { CreateQuestionDto, QuestionFilter } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './entities/question.entity';
import { Op } from 'sequelize';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ToolService } from 'src/tool/tool.service';
import { schedule_question_cron } from 'global.config';
import sequelize from 'sequelize';
import { NotifyHistory } from 'src/author/entities/notifyHistory';
import { NotifyReceiver } from 'src/author/entities/notifyReceiver.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(
    @InjectModel(Question) private questionModel: typeof Question,
    @InjectModel(NotifyHistory)
    private notifyHistoryModel: typeof NotifyHistory,
    @InjectModel(NotifyReceiver)
    private notifyReceiverModel: typeof NotifyReceiver,
    private scheduleRegistry: SchedulerRegistry,
    private readonly toolService: ToolService,
    private sequelize: Sequelize,
  ) {}

  /**
   * 创建问题
   * @param createQuestionDto
   * @param uid
   * @returns
   */
  async create(createQuestionDto: CreateQuestionDto, uid: number) {
    try {
      // 自动获取问题内容
      const { maxWeight } = await this.getMaxWeight(uid);
      const question = await this.toolService.getZhihuQuestionInfo(
        createQuestionDto.quesion_id,
      );
      return this.questionModel.create({
        quesion_id: question.id,
        question_title: question.title,
        question_desc: question.detail || '',
        question_author_id: question.author.id,
        question_author_name: question.author.name,
        question_author_avatar:
          question.author.avatar || question.author.avatarUrlTemplate,
        question_created: question.created,
        question_updated: question.updated,
        status: 0,
        uid: uid,
        weight: maxWeight ? maxWeight + 1 : 1,
      });
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
    return this.questionModel.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('weight')), 'maxWeight']],
      where: {
        uid: uid,
      },
      raw: true,
    });
  }

  /**
   * 获取最小排序值
   * @param uid
   * @returns
   */
  getMinWeight(uid: number): Promise<any> {
    return this.questionModel.findOne({
      attributes: [[sequelize.fn('MIN', sequelize.col('weight')), 'minWeight']],
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
  async findAll(param: QuestionFilter, uid: number) {
    const { page, size, search, status } = param;
    const data: any = {};
    const tmp: any = {
      order: [['weight', 'desc']],
      where: {
        uid: uid,
        [Op.or]: {
          quesion_id: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          question_title: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          question_desc: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          question_author_id: {
            [Op.like]: search ? `%${search}%` : '%%',
          },
          question_author_name: {
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
    const { count, rows } = await this.questionModel.findAndCountAll(tmp);
    data.total = count;
    data.items = rows;
    return data;
  }

  /**
   * 问题详情
   * @param id
   * @param uid
   * @returns
   */
  findOne(id: number, uid: number) {
    return this.questionModel.findOne({
      where: {
        id,
        uid,
      },
    });
  }

  /**
   * 删除问题
   * @param id
   * @param uid
   * @returns
   */
  async remove(id: number, uid: number) {
    const data = await this.questionModel.findOne({
      where: {
        id,
        uid,
      },
    });
    if (data) {
      this.stopNotify(data.quesion_id + '-' + data.id);
      this.deleteNotify(data.quesion_id + '-' + data.id);
    }
    return this.questionModel.destroy({
      where: {
        id,
        uid,
      },
    });
  }

  /**
   * 更新数据
   * @param updateDto
   * @param quesion_id
   * @param uid
   */
  update(updateDto: UpdateQuestionDto, id: number, uid: number) {
    return this.questionModel.update(
      {
        ...updateDto,
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
   * 开始通知：创建定时任务
   * @param time
   * @param obj
   * @param uid
   */
  startNotify(
    time: string,
    obj: { id: number; question_id: string },
    uid: number,
  ) {
    const { id, question_id } = obj;
    const job = new CronJob(time, async () => {
      // 在这里编写查询是否变红包任务的逻辑
      const last_question = await this.questionModel.findOne({
        where: {
          id,
        },
      });
      try {
        const { content, title, count_down_value } =
          await this.toolService.getZhihuQuestionRedPacket(question_id);
        if (count_down_value) {
          const notify_emails = await this.notifyReceiverModel.findAll({
            where: { uid, status: 1 },
          });
          // 第一步：邮箱通知
          await Promise.all(
            notify_emails.map(async (email) => {
              const notify_content = `【${last_question.question_title}】问题变红包了，<a href="https://www.zhihu.com/question/${question_id}" target="_blank">赶快去回答吧</a>！`;
              await this.notifyHistoryModel.create({
                obj_id: question_id,
                notify_type: 'question',
                notify_content: notify_content,
                uid,
              });
              return this.toolService.sendZhihuMail(
                `${notify_content}${content}`,
                email.email,
              );
            }),
          );
          // 第二步：更新状态
          let money = 0;
          const match = title.match(/\d+/);
          if (match) {
            money = parseInt(match[0]);
            await this.update(
              {
                question_red_money: money,
                question_red_count: count_down_value,
                notify_status: 1,
                notify_time: new Date().toUTCString(),
                status: 0,
              },
              id,
              uid,
            );
            // 第三步：关闭并删除定时任务
            this.stopNotify(question_id + '-' + id);
            this.deleteNotify(question_id + '-' + id);
          }
        }
      } catch (error) {
        // 不是红包问题：继续定时任务
        console.log(error);
      }
    });
    this.scheduleRegistry.addCronJob(question_id + '-' + id, job);
    job.start();
    this.logger.warn(`job ${question_id + '-' + id} added!`);
  }

  /**
   * 暂停通知
   * @param question_id
   */
  stopNotify(question_id: string) {
    const jobs = this.scheduleRegistry.getCronJobs();
    if (jobs.has(question_id)) {
      const job = this.scheduleRegistry.getCronJob(question_id);
      job && job.stop();
      this.logger.warn(`job ${question_id} stopped!`);
    }
  }

  /**
   * 删除通知
   * @param question_id
   */
  deleteNotify(question_id: string) {
    const jobs = this.scheduleRegistry.getCronJobs();
    if (jobs.has(question_id)) {
      const job = this.scheduleRegistry.getCronJob(question_id);
      job && this.scheduleRegistry.deleteCronJob(question_id);
      this.logger.warn(`job ${question_id} deleted!`);
    }
  }

  /**
   * 关闭定时任务
   * @param ids
   * @param uid
   * @returns
   */
  async toggleSchedule(id: number, uid) {
    const quesion = await this.findOne(id, uid);
    if (quesion.status) {
      this.stopNotify(quesion.quesion_id + '-' + quesion.id);
      this.deleteNotify(quesion.quesion_id + '-' + quesion.id);
    } else {
      this.startNotify(
        schedule_question_cron.replace(
          /second/g,
          new Date().getSeconds().toString(),
        ),
        {
          id: id,
          question_id: quesion.quesion_id,
        },
        uid,
      );
    }
    return this.questionModel.update(
      {
        status: quesion.status == 0 ? 1 : 0,
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
  async sort(id: number, direction: 'up' | 'down', uid) {
    const item = await this.findOne(id, uid);
    try {
      if (!item) {
        return { statusCode: 500, data: '数据不存在' };
      }
      switch (direction) {
        case 'up':
          const prevItem = await this.questionModel.findOne({
            where: {
              weight: {
                [Op.gt]: item.weight,
              },
              uid,
            },
            order: [['weight', 'asc']],
          });
          // 已经是第一个元素(weight值最大)，无法上移
          if (!prevItem) {
            return;
          }
          await this.sequelize.transaction(async (t) => {
            await this.questionModel.update(
              { weight: prevItem.weight },
              { where: { id: item.id, uid }, transaction: t },
            );
            await this.questionModel.update(
              { weight: item.weight },
              { where: { id: prevItem.id, uid }, transaction: t },
            );
          });
          return item;
        case 'down':
          const nextItem = await this.questionModel.findOne({
            where: {
              weight: {
                [Op.lt]: item.weight,
              },
              uid,
            },
            order: [['weight', 'desc']],
          });
          // 已经是第最后一个元素(weight值最小)，无法下移
          if (!nextItem) {
            return;
          }
          await this.sequelize.transaction(async (t) => {
            await this.questionModel.update(
              { weight: nextItem.weight },
              { where: { id: item.id, uid }, transaction: t },
            );
            await this.questionModel.update(
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
}
