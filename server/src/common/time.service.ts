import { Injectable } from "@nestjs/common";
const moment = require('moment');

@Injectable()
export class TimeService {
  /**
   * 格式化时间
   * @param time 时间 
   * @param patten 格式魔板
   * @returns 
   */
  formatTime (time: any = null, patten = 'YYYY-MM-DD HH:mm:ss') {
    return moment(time ? time : moment()).format(patten)
  }
  /**
   * 比较两个时间
   * @param current 当前时间
   * @param target 目标时间
   * @param patten 比较类型
   * @returns 大于0：在当前时间之后 小于0：在当前时间之内
   */
  diffTime (current: any, target: any, patten = 's') {
    return moment(current ? current : moment()).diff(moment(target), patten as any)
  }

  /**
   * 获取当前格式化时间
   * @param patten 
   * @returns 
   */
  getCurrentTime (patten = 'YYYY-MM-DD HH:mm:ss') {
    return moment(moment()).format(patten)
  }

  /**
   * 生成由当前时间创建的名称
   * @returns 
   */
  getTimeRandom () {
    const randomNum = Math.floor(Math.random() * 900) + 100 // 生成一个3位随机数
    return moment().format('YYYYMMDDHHmmss') + randomNum + Math.floor(Math.random() * 10)
  }
}