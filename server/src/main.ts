import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponse } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { VersioningType } from '@nestjs/common';
// import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 启用跨域
  app.enableCors({
    origin: true
  })
  // 配置静态目录
  app.useStaticAssets(join(__dirname, 'public'), {
    prefix: '/public' // 访问前缀，如果不配置则默认是 /
  })
  app.enableVersioning({
    type: VersioningType.URI
  })
  // swagger配置
  const config = new DocumentBuilder().addBearerAuth().setTitle('LightFastPicture接口文档').setDescription('轻量级快捷图片管理系统之使用nestjs重构接口').setVersion('2.0').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  app.useGlobalInterceptors(new FormatResponse())
  app.useGlobalFilters(new HttpExceptionFilter())
  // 启用压缩
  app.use(compression())
  // 配置避免csrf攻击
  // app.use(csurf())
  await app.listen(process.env.APP_PORT);
}
bootstrap();
