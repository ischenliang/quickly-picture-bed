import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs'
import { VerifyCodeService } from 'src/common/verifycode.service';
import { InjectModel } from '@nestjs/sequelize';
import { VerifyCode } from 'src/common/entities/verifyCode.entity';
import { Op } from 'sequelize';
import { TimeService } from 'src/common/time.service';
import * as moment from 'moment';
import { SmsCode } from 'src/common/entities/smsCode.entity';
import { map } from 'rxjs'
import { HttpService } from '@nestjs/axios';
import * as iconv from 'iconv-lite'
import axios from 'axios';
import * as cheerio from 'cheerio'
import * as puppeteer from 'puppeteer'
import { DictService } from 'src/dict/dict.service';

interface ZhihuPage {
  url: string // 网页地址
  page: any // 打开的网页实例
  id: number // 打开标签页的id
}
/**
 * 存储当前打开的所有标签页
 */
const pages: ZhihuPage[] = []
const maxPage = 5 // 最大打开页面数量

@Injectable()
export class ToolService {
  private readonly logger = new Logger(ToolService.name)
  constructor (
    private verifyCodeService: VerifyCodeService,
    private timeService: TimeService,
    private httpService: HttpService,
    private dictService: DictService,
    @InjectModel(VerifyCode) private verifyCodeModel: typeof VerifyCode,
    @InjectModel(SmsCode) private smsCodeModel: typeof SmsCode
  ) {}

  async upload(file, path) {
    // 解决中文乱码问题
    file.originalname = iconv.decode(file.originalname as any, 'utf8') || file.originalname
    // 目标目录，没有这个文件夹会自动创建
    const directory = join(__dirname, '../public/', path)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
    const dest = join(__dirname, '../public/', path, file.originalname)
    fs.writeFileSync(dest, file.buffer)
    return {
      name: file.originalname,
      img_url: path.replace(/^\//g, '') + file.originalname,
      hash: ''
    }
  }

  /**
   * 生成图形验证码
   * @param last_id 上一次id，首次传入"-"
   * @returns 
   */
  async imgCreate (last_id: string) {
    const { text, data } = this.verifyCodeService.generateImgCode()
    if (last_id !== '-') {
      await this.verifyCodeModel.destroy({
        where: {
          id: last_id
        }
      })
    }
    // 删除所有已过期的验证码
    await this.verifyCodeModel.destroy({
      where: {
        expire_at: {
          [Op.lt]: new Date()
        }
      }
    })
    // 生成最新的验证码
    const verifyCode = await this.verifyCodeModel.create({
      code: data,
      anser: text,
      expire_at: this.timeService.formatTime(moment().add(10, 'm'))
    })
    return {
      id: verifyCode.id,
      data
    }
  }

  /**
   * 图片验证码校验
   * @param param 
   * @returns 
   */
  async imgCheck (param: { id: number, anser: string }) {
    const data = await this.verifyCodeModel.findOne({
      where: {
        id: param.id
      }
    })
    if (data && this.timeService.diffTime(null, data.expire_at) <= 0) {
      const flag = data.anser.toUpperCase() === param.anser.toUpperCase()
      if (flag) {
        // 校验成功后需要将其状态改为已过期
        await this.verifyCodeModel.update({
          expire_at: this.timeService.formatTime(moment())
        }, {
          where: {
            id: param.id
          }
        })
        return {
          statusCode: 200,
          data: '校验成功'
        }
      }
      return {
        statusCode: 500,
        data: '校验失败'
      }
    }
    return {
      statusCode: 500,
      data: '验证码已过期，请重新生成'
    }
  }

  /**
   * 发送sms验证码
   * @param param 
   */
  async smsSend (param: { account: string, verify_code: string, verify_id: string, type: 'email' | 'phone' }) {
    const verifyCode = await this.verifyCodeModel.findOne({
      where: {
        id: param.verify_id
      }
    })
    if (verifyCode && this.timeService.diffTime(null, verifyCode.expire_at) <= 0) {
      const flag = verifyCode.anser.toUpperCase() === param.verify_code.toUpperCase()
      if (flag) {
        const code = this.verifyCodeService.generateSmsCode()
        if (param.type === 'email') {
          try {
            // 清除已过期的数据
            await this.smsCodeModel.destroy({
              where: {
                expire_at: {
                  [Op.lt]: new Date()
                }
              }
            })
            // 删除和用户account相关的数据
            // await this.smsCodeModel.destroy({
            //   where: {
            //     account: param.account
            //   }
            // })

            // 发送验证码
            await this.verifyCodeService.sendMail(code, param.account)
            // 创建新的验证码
            const smscode = await this.smsCodeModel.create({
              account: param.account,
              type: param.type,
              code: code,
              expire_at: this.timeService.formatTime(moment().add(3, 'm'))
            })
            return {
              id: smscode.id
            }
          } catch (error) {
            return {
              statusCode: 500,
              data: error.message
            }
          }
        } else {
          return {
            statusCode: 500,
            data: '暂不支持其他验证码功能'
          }
        }
      } else {
        return {
          statusCode: 500,
          data: '图形验证码不正确'
        }
      }
    }
    return {
      statusCode: 500,
      data: '验证码已过期，请重新生成'
    }
  }

  /**
   * 获取指定邮箱的最后一个验证码
   * Todo: 后续应该加上验证码的id
   * @param email 
   * @returns 
   */
  async smscodeCheck (email: string, code: string) {
    const data = await this.smsCodeModel.findOne({
      where: {
        account: email
      },
      order: [
        ['updatedAt', 'desc']
      ],
      raw: true
    })
    // 1. 判断验证码是否过期
    if (data && this.timeService.diffTime(null, data.expire_at) <= 0) {
      if (data.code === code) {
        // 校验成功后需要将其状态改为已过期
        await this.smsCodeModel.update({
          expire_at: this.timeService.formatTime(moment())
        }, {
          where: {
            account: email
          }
        })
        return {
          statusCode: 200,
          data: '校验成功'
        }
      }
      return {
        statusCode: 500,
        data: '校验失败'
      }
    }
    return {
      statusCode: 500,
      data: '验证码已过期，请重新生成'
    }
  }

  /**
   * 获取npm包的package.json
   * @param name 
   * @returns 
   */
  async npmRegistryPackage (name: string) {
    // 不能直接返回: 原因在于aliyun对象存储返回数据为空，然后nestjs会处理json数据，故出问题了报错
    // 这里如果直接返回需考虑接口返回的结果是否为空，如果为空则会出现下面的错误信息： 原因在于返回的结果是空，但是nestjs会帮我们转成json数据，故就报错了
    // [Nest] 11336  - 2023/09/14 15:43:27   ERROR [ExceptionsHandler] Converting circular structure to JSON
    // --> starting at object with constructor 'ClientRequest'
    // |     property 'socket' -> object with constructor 'TLSSocket'
    // --- property '_httpMessage' closes the circle
    // TypeError: Converting circular structure to JSON
    return this.httpService.get(`https://registry.npmjs.org/${name}`).pipe(map(res => {
      const { versions, readme, readmeFilename, time, ...pkgInfo } = res.data
      return {
        pkgInfo,
        versions: Object.keys(versions)
      }
    }))
  }

  /**
   * 发送邮件服务
   * @param text 
   * @param to 
   * @param subject 
   * @returns 
   */
  sendZhihuMail (text: string, to: string | string[], subject: string = 'LightFastPicture') {
    this.logger.warn('正在发送邮件:' + to)
    return this.verifyCodeService.sendZhihuMail(text, to, subject)
  }

  /**
   * 获取知乎个人信息
   * @param author_id 账号id
   * @param is_org 是否机构
   * @returns 
   */
  async getZhihuUserInfo (author_id: string, is_org: boolean) {
    const { cookie } = await this.useGetCookie()
    const res = await axios({
      url: `https://www.zhihu.com/${is_org ? 'org' : 'people'}/${author_id}`,
      method: 'get',
      headers: {
        Cookie: cookie
      }
    })
    const $ = cheerio.load(res.data)
    const initialDataEl = $('script#js-initialData')
    const initialDataJson = initialDataEl.text()
    const initialData = JSON.parse(initialDataJson)
    const user = initialData.initialState.entities.users[author_id]
    return user
  }

  /**
   * 获取知乎用户的最新几个问题
   * @param author_id 
   * @param is_org 
   * @returns 
   */
  async getZhihuUserQuestionsAndAnswers(author_id: string, is_org: boolean) {
    const res = await axios({
      url: `https://www.zhihu.com/${is_org ? 'org' : 'people'}/${author_id}`
    })
    const $ = cheerio.load(res.data)
    const unHuman = $('p.Unhuman-tip')
    if (unHuman && unHuman.text() === '系统监测到您的网络环境存在异常风险，为保证您的正常访问，请输入验证码进行验证。') {
      this.logger.error('==============知乎判定为人机====================')
      throw new Error('知乎判定为人机')
    }
    const initialDataEl = $('script#js-initialData')
    const initialDataJson = initialDataEl.text()
    const initialData = JSON.parse(initialDataJson)
    const questions = initialData.initialState.entities.questions
    const answers = initialData.initialState.entities.answers
    return {
      questions,
      answers
    }
  }

  /**
   * 获取问题详情
   * @param question_id 问题id
   * @returns 
   */
  async getZhihuQuestionInfo(question_id: string) {
    const { cookie } = await this.useGetCookie()
    const res = await axios({
      url: `https://www.zhihu.com/question/${question_id}`,
      method: 'get',
      headers: {
        Cookie: cookie
      }
    })
    const $ = cheerio.load(res.data)
    // 获取问题详情
    const initialData = JSON.parse($('script#js-initialData').text())
    const question = initialData.initialState.entities.questions[question_id]
    // 获取问题创建和更新时间
    const created = $('meta[itemProp="dateCreated"]').get(0).attribs.content
    const updated = $('meta[itemProp="dateModified"]').get(0).attribs.content
    return {
      id: question.id,
      title: question.title,
      questionType: question.questionType,
      detail: question.detail,
      updated,
      created,
      author: {
        id: question.author.urlToken,
        avatar: question.author.avatarUrl,
        avatarUrlTemplate: question.author.avatarUrlTemplate || '',
        name: question.author.name
      }
    }
  }

  /**
   * 获取问题是否变红包问题
   * @param question_id 
   * @returns 
   */
  async getZhihuQuestionRedPacket (question_id: string) {
    const { cookie } = await this.useGetCookie()
    const res = await axios({
      url: `https://www.zhihu.com/api/v4/brand/questions/${question_id}/activity/red-packet`,
      method: 'get',
      headers: {
        Cookie: cookie,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Cache-Control': 'max-age=0',
        'Priority': 'u=0, i',
        'Sec-Ch-Ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    })
    return res.data
  }

  /**
   * 获取登录失效cookie
   * @returns 
   */
  useGetCookie (): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.dictService.findByPro({ property: 'code', value: 'zhihu_config' })
        // this.logger.debug('zhihu_config: ' + JSON.stringify(res))
        const zhihu_config = res.values.reduce((total, cur) => {
          total[cur.label] = cur.value
          return total
        }, {})
        resolve(zhihu_config)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 获取chrome的版本信息
   */
  useGetWebSocketDebuggerUrl (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.log('获取浏览器的webSocketDebuggerUrl------->')
      axios({
        url: 'http://127.0.0.1:9222/json/version',
        method: 'get'
      }).then(res => {
        const { webSocketDebuggerUrl, Browser } = res.data
        resolve({
          webSocketDebuggerUrl
        })
      }).catch(error => {
        this.logger.log('useGetWebSocketDebuggerUrl Error: ' + error.message)
        resolve({
          webSocketDebuggerUrl: ''
        })
      })
    })
  }

  /**
   * 使用Puppeteer
   * @returns 
   */
  usePuppeteer (): Promise<any> {
    this.logger.debug('准备打开浏览器------->')
    return new Promise(async (resolve, reject) => {
      try {
        const { cookie, endpoint } =  await this.useGetCookie()
        const { webSocketDebuggerUrl } = await this.useGetWebSocketDebuggerUrl()
        // 1、连接本机浏览器
        const browser = await puppeteer.connect({
          browserWSEndpoint: webSocketDebuggerUrl || endpoint,
          defaultViewport: {
            width: 1920,
            height: 1080
          }
        })
        // 2、创建一个浏览器的新网页并设置视图窗口大小
        let page = await browser.newPage()
        await page.setViewport({ width: 1920, height: 1080 })
        // 3、返回页面
        resolve({
          page,
          cookie,
          browser
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 处理cookie
   */
  async handleCookie (page: any) {
    // 1、读取所有的cookie
    const cookies = await page.cookies()
    // 2、处理cookie
    const filter_cookies = cookies.filter(el => /zhihu.com/g.test(el.domain)).map(el => ({ name: el.name, value: el.value }))
    // 3、将cookie处理成字符串
    const cookies_str = filter_cookies.map(el => (`${el.name}=${el.value}`)).join('; ')
    // 4、获取cookie的数据
    const condition = { property: 'code', value: 'zhihu_config' }
    const res = await this.dictService.findByPro(condition)
    res.values.forEach(el => {
      if (el.label === 'cookie') {
        el.value = cookies_str
      }
    })
    // 5、更新到数据库
    await this.dictService.updateByPro(condition, {
      name: res.name,
      code: res.code,
      values: res.values
    })
  }

  /**
   * 关闭遗留页面
   * @param browser Puppeteer.Browser
   */
  async closeOverPage (browser: any) {
    try {
      // 方式一：自存页面，超出最大限制: 关闭所有页面
      if (pages.length >= maxPage) {
        for (let i = 0; i < pages.length; i++) {
          // 1. 移除当前页面数据
          // 放在第一步原因：可能当前标签页已经被关闭了的
          pages.splice(i, 1)
          // 2. 关闭标签页
          await pages[i].page.close({ timeout: 1500 })
        }
      }
      // =====================关闭遗留的页面start====================
      /**
       * 关闭方式三：为了解决puppeteer遗留的页面
       * 通过判断当前浏览器打开的标签页是否超过指定数量
       *  如果超过则直接关闭和知乎以及about:blank相关的页面
       */
      const browser_pages = await browser.pages()
      if (browser_pages && browser_pages.length >= 5) {
        for (let browser_page of browser_pages) {
          const browser_page_url = browser_page.url()
          if (browser_page_url.indexOf('www.zhihu.com') !== -1 || browser_page_url.indexOf('about:blank') !== -1) {
            await browser_page.close({ timeout: 2000 })
            this.logger.warn('关闭遗留页面' + browser_page_url)
          }
        }
      }
      // =====================关闭遗留的页面end====================
    } catch (error) {
      this.logger.error('closeOverPage Error: ' + error.message)
    }
  }

  /**
   * 获取最新的cookie
   */
  async getLastCookie () {
    try {
      const { bind_url } = await this.useGetCookie()
      const { page, browser } = await this.usePuppeteer()
      // 1. 打卡页面
      this.logger.debug('cookie的bind_url: ' + bind_url)
      await page.goto(bind_url)
      const page_id = Date.now()
      pages.push({ url: bind_url, page: page, id: page_id })
      // 2. 处理并保存cookie
      await this.handleCookie(page)
      // 4、最后：关闭页面(减少内存占用)
      await page.close({ timeout: 2000 })
      // 5、断开浏览器连接
      await browser.disconnect()
      // 6、如果成功关闭了页面：则移除
      pages.splice(pages.findIndex(el => el.id === page_id), 1)
    } catch (error) {
      this.logger.debug('ToolService-->getLastCookie Error: ' + JSON.stringify(error))
    }
  }

  /**
 * 获取指定类型的问题
 * @param {*} page puppeteer的page实例
 * @param {*} type answer-回答 | follow-关注 | publish-发布
 * @returns 
 */
  async getNewQuestions (page, type) {
    try {
      const extraInfo = {
        answer: '回答了问题',
        follow: '关注了问题',
        publish: '添加了问题'
      }
      const list = await page.$$('div.List-item')
      const questions = []
      for (const item of list) {
        const tips = await page.evaluate(el => {
          const element = el.querySelector('.List-itemMeta .ActivityItem-metaTitle')
          return element ? element.textContent : ''
        }, item)
        if (tips === extraInfo[type]) {
          const contentInfo = await page.evaluate(el => {
            const contentEl = el.querySelector('div.ContentItem')
            return JSON.parse(contentEl.getAttribute('data-za-extra-module'))
          }, item)
          let title = '', question_id = ''
          switch (type) {
            case 'answer':
              title = await page.evaluate(el => {
                const contentEl = el.querySelector('div.ContentItem')
                return JSON.parse(contentEl.getAttribute('data-zop')).title
              }, item)
              question_id = contentInfo.card.content.parent_token
              break
            case 'follow':
            case 'publish':
              title = await page.evaluate(el => el.querySelector('div.ContentItem div.QuestionItem-title a').textContent, item)
              question_id = contentInfo.card.content.token
              break
          }
          questions.push({
            id: question_id,
            title,
            type
          })
        }
      }
      return questions
    } catch (error) {
      this.logger.debug('getNewQuestions Error: ' + error.message)
      return []
    }
  }

  /**
   * 获取作者的最新问题(题主-新添加问题，答主-新回答/关注问题)
   * @param {*} type answer | publisher
   * @returns 
   */
  async getAuthorNewQuestions (author_id: string, is_org: boolean, type: 'answer' | 'publisher'): Promise<any> {
    this.logger.debug('正在获取作者的最新问题: ' + author_id)
    try {
      const { page, browser } = await this.usePuppeteer()
      // 关闭遗留页面
      await this.closeOverPage(browser)
      // 1、打开指定页面
      const targetUrl = `https://www.zhihu.com/${is_org ? 'org' : 'people'}/${author_id}`
      await page.goto(targetUrl);
      const page_id = Date.now() + Math.ceil(Math.random() * 10)
      pages.push({ url: targetUrl, page: page, id: page_id })
      // 2、等待Profile-activities元素的出现：代表数据已加载并渲染完毕
      await page.waitForSelector('div#Profile-activities div.List-item[tabindex="0"]', { timeout: 3000 })
      // 3、获取问题列表
      let questions = []
      switch (type) {
        // 针对答主：只需要关注回答或者关注问题即可
        case 'answer':
          questions = [...questions, ...await this.getNewQuestions(page, 'answer')]
          questions = [...questions, ...await this.getNewQuestions(page, 'follow')]
          break
        // 针对题主：只需要关注添加问题即可
        case 'publisher':
          questions = [...questions, ...await this.getNewQuestions(page, 'publish')]
          break
      }
      questions.forEach(el => console.log(el.title, el.id))
      // 4、更新cookie
      await this.handleCookie(page)
      // 4、最后：关闭页面(减少内存占用)
      await page.close({ timeout: 2000 })
      // 5、断开浏览器连接
      await browser.disconnect()
      // 6、页面成功关闭：移除当前标签页
      pages.splice(pages.findIndex(el => el.id === page_id), 1)
      this.logger.warn('页面已成功关闭: ' + targetUrl)
      return questions
    } catch (error) {
      this.logger.debug('getAuthorNewQuestions Error:' + error.message)
      return []
    } finally {}
  }
}
