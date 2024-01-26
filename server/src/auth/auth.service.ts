import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Md5Service } from 'src/common/md5.service';
import { ToolService } from 'src/tool/tool.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly toolService: ToolService,
    private readonly md5Service: Md5Service,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 校验用户
   * @param email 
   * @param password 
   * @returns 
   */
  async validateUser (email: string, password: string) {
    const user = await this.userService.findOneByEmail(email)
    if (user && user.password === this.md5Service.cryptoMd5(password)) {
      return user
    }
    return null
  }

  /**
   * 图形验证码校验
   * @param verify_id 
   * @param verify_code 
   */
  async validateCaptcha (verify_id: number, verify_code: string) {
    const res = await this.toolService.imgCheck({
      id: verify_id,
      anser: verify_code
    })
    return res
  }

  async login (user: any) {
    let obj = {
      id: user.id,
      email: user.email,
      role: user.role
    }
    return {
      access_token: this.jwtService.sign(obj)
    }
  }
}
