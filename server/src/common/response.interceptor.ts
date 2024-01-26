import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from 'rxjs'

interface Data<T> {
  data: T
}

@Injectable()
export class FormatResponse<T> implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(map(data => {
      if (data && data.statusCode) {
        return {
          data: data.data,
          code: data.statusCode,
          msg: 'success',
          success: true
        }
      }
      return {
        data: data,
        code: 200,
        msg: 'success',
        success: true
      }
    }))
  }
}