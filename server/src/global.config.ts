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