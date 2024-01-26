import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserFilter } from './dto/create-user.dto';
import { UpdateHabitDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { Md5Service } from 'src/common/md5.service';
import { Habits } from './entities/habits.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserService {

  constructor (
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Habits) private habitsModel: typeof Habits,
    private sequelize: Sequelize,
    private readonly md5Service: Md5Service
  ) {}

  /**
   * 创建用户
   *   1、需要根据邮箱判断当前用户是否已存在
   *   2、若不存在则创建，并且使用事务进行默认数据创建
   * @param createUserDto 
   * @returns 
   */
  async create(createUserDto: CreateUserDto) {
    // Todo: 还需将一些默认数据创建
    let result: User = null
    result = await this.userModel.findOne({
      where: {
        email: createUserDto.email
      }
    })
    if (result) {
      return {
        statusCode: 500,
        message: '账号已存在',
        data: '账号已存在'
      }
    }
    // 执行事务
    try {
      await this.sequelize.transaction(async transaction => {
        // 第一步：创建用户
        result = await this.userModel.create({
          ...createUserDto,
          password: this.md5Service.cryptoMd5(createUserDto.password)
        }, {
          transaction
        })
        // 第二步：创建用户习惯等一些默认数据
        await this.habitsModel.create({
          uid: result.id
        }, {
          transaction
        })
      })
      return result
    } catch (error) {
      throw error
      // 一旦发生错误，事务会回滚
      // 该事务已由 Sequelize 自动回滚！
    }
  }

  async findAll(param: UserFilter) {
    const { page, size, search, role } = param
    const data: any = {}
    const tmp: any = {
      order: [
        ['updatedAt', 'desc']
      ],
      where: {
        [Op.or]: [
          { email: { [Op.like]: search ? `%${search}%` : '%%' } },
          { phone: { [Op.like]: search ? `%${search}%` : '%%' } },
          { username: { [Op.like]: search ? `%${search}%` : '%%' } }
        ]
      }
    }
    if (role) {
      tmp.where.role = role
    }
    if (page) {
      tmp.limit = size || 10
      tmp.offset = page ? (page - 1) * size : 0
    }
    const { count, rows } = await this.userModel.findAndCountAll(tmp)
    data.total = count
    data.items = rows
    return data;
  }

  /**
   * 根据邮箱查询用户
   * @param email 
   * @returns 
   */
  findOneByEmail(email: string) {
    return this.userModel.findOne({
      where: {
        email: email
      }
    });
  }
  
  /**
   * 根据用户id查询用户
   * @param id 
   */
  findOne (id: number) {
    return this.userModel.findOne({
      where: {
        id
      }
    })
  }
  
  /**
   * 根据用户id查询用户
   * @param id 
   */
  findProfile (id: number) {
    return this.userModel.findOne({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      },
      where: {
        id
      }
    })
  }

  /**
   * 更新用户
   * @param updateUserDto 
   * @returns 
   */
  update(updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, {
      where: {
        id: updateUserDto.id
      }
    })
  }

  /**
   * 删除用户，需要将关联的数据都删除
   * @param id 用户id
   * @returns 
   */
  remove(id: number) {
    // 方式一: 老老实实的去每张表调用desctroy方法
    return this.userModel.destroy({
      where: {
        id
      }
    });

    // 方式二: 使用事务进行操作
    // 可以保证数据库的一致性，要么都成功，要么都失败，而不会导致某一数据删除成功，一部分数据删除失败
    // this.sequelize.transaction(async (transaction) => {
    //   await this.userModel.destroy({
    //     where: {
    //       id
    //     },
    //     transaction
    //   })
    //   // ...
    // })
  }

  /**
   * 获取用户使用习惯
   * @param uid 
   * @returns 
   */
  getUserHabits (uid: number) {
    return this.habitsModel.findOne({
      where: {
        uid: uid
      }
    })
  }

  /**
   * 获取用户使用习惯
   * @param uid 
   * @returns 
   */
  updateUserHabits (param: UpdateHabitDto, uid: number) {
    return this.habitsModel.update(param, {
      where: {
        uid: uid
      }
    })
  }

  /**
   * 切换用户状态
   * @param id 
   * @returns 
   */
  async toggle (id: number) {
    const user = await this.userModel.findOne({
      where: {
        id
      },
      raw: true
    })
    if (user) {
      return this.userModel.update({
        status: !user.status
      }, {
        where: {
          id
        }
      })
    }
    return {
      statusCode: 500,
      data: '用户不存在'
    }
  }

  /**
   * 修改密码
   * @param uid 
   * @param password 
   * @returns 
   */
  async changePwd (uid: number, password: string, old_password: string = '', type : 'reset' | 'change' = 'reset') {
    // 1、判断修改密码用途
    if (type === 'change') {
      const tmp = await this.userModel.findOne({
        where: {
          id: uid
        }
      })
      if (tmp && tmp.password !== this.md5Service.cryptoMd5(old_password)) {
        return {
          statusCode: 500,
          data: '原密码错误，请重新输入'
        }
      }
    }
    return this.userModel.update({
      password: this.md5Service.cryptoMd5(password)
    }, {
      where: {
        id: uid
      }
    })
  }
}
