import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ToolModule } from './tool/tool.module';
import { AuthModule } from './auth/auth.module';
import { PluginModule } from './plugin/plugin.module';
import { DictModule } from './dict/dict.module';
import { AlbumModule } from './album/album.module';
import { AlbumTagsModule } from './album-tags/album-tags.module';
import { SettingModule } from './setting/setting.module';
import { WikiModule } from './wiki/wiki.module';
import { ArticleModule } from './article/article.module';
import { BucketModule } from './bucket/bucket.module';
import { ImageModule } from './image/image.module';
import { LogModule } from './log/log.module';
import { StatsModule } from './stats/stats.module';
import { SmsCode } from './common/entities/smsCode.entity';
import { User } from './user/entities/user.entity';

console.log(process.env.NODE_ENV)
@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: {
        development: ['.env.dev'],
        production: ['.env']
      }[process.env.NODE_ENV || 'production'], // 自定义环境变量文件路径
      // 是否是全局模块
      isGlobal: true,
    }),
    // 环境变量的使用方式二并结合ConfigService使用
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          synchronize: true,
          autoLoadModels: true,
          retryDelay: 500,
          retryAttempts: 10,
        }
      },
      inject: [ConfigService]
    }),
    UserModule,
    ToolModule,
    AuthModule,
    PluginModule,
    DictModule,
    AlbumModule,
    AlbumTagsModule,
    SettingModule,
    WikiModule,
    ArticleModule,
    BucketModule,
    ImageModule,
    LogModule,
    StatsModule,
    SequelizeModule.forFeature([SmsCode, User])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
