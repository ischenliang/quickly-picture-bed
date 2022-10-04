import { Habits } from './typings/interface';
export const user_habits: Habits = {
  shortKey: [
    { label: '快捷上传', key: 'upload', value: 'Command + Shift + P' }
  ],
  showUpdateTip: true,
  showCopyTip: true,
  showDeleteTip: true,
  rename: false,
  autoRename: true,
  autoPaste: true,
  pasteStyle: 'markdown',
  current: '',
  link_format: '![]($url)',
}