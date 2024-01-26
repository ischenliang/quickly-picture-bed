import { ApiProperty } from "@nestjs/swagger"
import { PageSearch } from "src/common/dto/pageSearch.entity"

export enum LogType {
  Login = 11, // 系统登录
  PictureUpload = 21, // 图片上传
  PictureDelete = 22, // 图片删除
  PictureUpdate = 23, // 图片更新
  ChatGPT = 31, // ChatGPT
  BucketCreate = 41, // 存储桶创建
  BucketUpdate = 42, // 存储桶更新
  BucketDelete = 43, // 存储桶删除
  AlbumCreate = 51, // 相册创建
  AlbumUpdate = 52, // 相册更新
  AlbumDelete = 53, // 相册删除
  PluginCreate = 61, // 创建插件
  PluginUpdate = 62, // 更新插件
  PluginDelete = 63, // 删除插件
  PluginInstall = 64, // 安装插件
  PluginUninstall = 65, // 卸载插件
  PluginInstallUpdate = 66, // 更新安装插件
}

// 操作客户端信息
export interface ClientInfo {
  ip: string // ip地址
  adcode: string // 城市代码
  province: string // 城市省份
  city: string // 所属城市
  district: string // 所属区域
  type: string // 使用的什么定位方式：baidu、gaode、tencent
  rectangle: { // 经纬度
    x: string // 经度
    y: string // 纬度
  }
}

export class CreateLogDto {
  id?: number // 日志id
  type: LogType // 日志类别
  operate_id: number // 操作记录id
  operate_cont: string // 操作记录内容
  client_info?: ClientInfo // 操作客户端信息
  uid?: number // 用户id
  email?: string // 用户邮箱
}


export class LogFilter extends PageSearch {
  @ApiProperty({ description: '日志类别' })
  type: LogType
}