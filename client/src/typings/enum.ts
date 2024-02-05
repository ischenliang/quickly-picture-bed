/**
 * 存储源可选几种存储桶类型
 */
export enum BucketSourceEnum {
  Qiniu = 'qiniu',
  Oss = 'oss'
}

/**
 * 存储源配置项的类型
 */
export enum BucketSourceConfigTypeEnum {
  // string = 
}


/**
 * 角色枚举
 */
export enum RoleEnum {
  Guest = 1, // 游客
  Programmer = 2, // 程序猿
  Admin = 10 // 管理员
}