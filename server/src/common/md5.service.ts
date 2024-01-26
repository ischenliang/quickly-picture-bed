import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto';

@Injectable()
export class Md5Service {
  /**
  * 密码md5加密
  * @param pwd 密码
  * @param suffix 秘钥
  * @returns 
  */
  cryptoMd5 (pwd: string, suffix: string = 'a1b2c3') {
    const hash = crypto.createHash('md5');
    const hashedPassword = hash.update(pwd + suffix).digest('hex');
    return hashedPassword
  }
}