export enum Role {
  Guest = 1, // 普通用户
  Developer = 2, // 开发者
  Admin = 10 // 管理员
}

// 1: 登录系统 2：上传图片 3：删除图片 4：更新图片
export enum LogEnum {
  Login = 1, // 登录系统
  Upload = 2, // 上传图片
  Delete = 3, // 删除图片
  Update = 4, // 更新图片
}