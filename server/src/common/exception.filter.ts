import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const [req, res, next] = [ctx.getRequest<Request>(), ctx.getResponse<Response>(), ctx.getNext()]

    const status = exception.getStatus()

    res.status(status).json({
      success: false,
      data: exception.message,
      code: status,
      msg: 'fail'
    })
  }
}