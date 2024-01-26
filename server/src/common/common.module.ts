import { Global, Module } from "@nestjs/common";
import { Md5Service } from "./md5.service";
import { VerifyCodeService } from "./verifycode.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { VerifyCode } from "./entities/verifyCode.entity";
import { SmsCode } from "./entities/smsCode.entity";
import { TimeService } from "./time.service";
import { GiteeService } from "./gitee.service";
import { HttpModule } from "@nestjs/axios";
import { PluginLoaderService } from "./pluginLoader.service";

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([VerifyCode, SmsCode]),
    HttpModule
  ],
  providers: [Md5Service, VerifyCodeService, TimeService, GiteeService, PluginLoaderService],
  exports: [Md5Service, VerifyCodeService, TimeService, GiteeService, PluginLoaderService]
})
export class CommonModule {}