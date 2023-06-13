import { Habits } from "./types";

export const default_habits: Habits = {
  shortKey: [
      {
        "label": "点击快捷键自动上传粘贴板中的图片",
        "value": "Command + K",
        "key": "快捷上传",
        "id": 1
      },
      {
        "label": "点击快捷键自动打开帮助中心窗口",
        "value": "Command + H",
        "key": "帮助中心",
        "id": 2
      },
      {
        "label": "点击快捷键自动进入个人中心",
        "value": "Command + P + C",
        "key": "个人中心",
        "id": 3
      },
      {
        "label": "点击快捷键自动上传粘贴板中的网络图片",
        "value": "Command + P + C",
        "key": "上传网络图片",
        "id": 4
      },
      {
        "label": "点击快捷键自动退出登录",
        "value": "Command + P + C",
        "key": "快捷退出",
        "id": 5
      }
  ],
  showUpdateTip: true,
  showDeleteTip: true,
  showCopyTip: true,
  autoPaste: true,
  current: {},
  link_format: '![${filename}](${url})',
  pasteStyle: 'url'
}


export const mimeTypes = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  jp2: 'image/jp2',
  jpe: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  ico: 'image/x-icon',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  wbmp: 'image/vnd.wap.wbmp',
  jng: 'image/x-jng',
  bmp: 'image/x-ms-bmp',
  svg: 'image/svg+xml',
  svgz: 'image/svg+xml',
  cgm: 'image/cgm',
  djv: 'image/vnd.djvu',
  djvu: 'image/vnd.djvu',
  ief: 'image/ief',
  mac: 'image/x-macpaint',
  pct: 'image/pict',
}

/**
 * mysql数据库配置
 */
export const databaseConfig = {
  host: 'localhost', // 数据库ip，默认是localhost
  port: 3306, // 数据库端口，默认3306
  database: 'picture-bed-local', // 数据库
  username: 'root', // mysql用户名，默认是root
  password: '100259' // mysql密码
}