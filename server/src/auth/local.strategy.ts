import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (private readonly authService: AuthService) {
    // 这里需要严格注意: 如果不指定usernameField的话，默认是安装username字段校验，否则会永远报401错误
    super({ usernameField: 'email' }) // 指定使用 email 字段作为用户名字段
  }

  async validate (email: string, password: string) {
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}