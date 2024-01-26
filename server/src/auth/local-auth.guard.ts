import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}