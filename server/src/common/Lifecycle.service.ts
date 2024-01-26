import { Injectable } from '@nestjs/common'

@Injectable()
export class LifecycleService {
  // 上传之前生命周期钩子
  beforeUpload () {}
  // 上传生命周期钩子
  upload () {}
  // 上传之后生命周期钩子
  afterUpload () {}
}