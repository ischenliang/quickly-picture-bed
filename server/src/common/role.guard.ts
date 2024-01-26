import { Injectable } from "@nestjs/common/decorators";
import { CanActivate, ExecutionContext } from "@nestjs/common/interfaces";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { roles } from "src/constants";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor (private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request & { user: User} = context.switchToHttp().getRequest()
    const admin = this.reflector.get<string[]>('roles', context.getHandler())
    // console.log('接口所需角色:', admin)
    if (!admin) {
      return true
    }
    if (req.user && admin.includes(roles[req.user.role])) {
      return true
    }
    return false
  }
}