import { ref, Ref } from 'vue';
import { HabitsInter } from './typings/interface';
export const user_habits: HabitsInter = {
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
  link_format: 'URL',
}




export interface Link {
  label: string
  value: string
}

// 链接类型列表
// 占位符$url：表示图片的url地址
// 占位符$filename：表示文件名
export const linkTypes: Ref<Link[]> = ref([
  { label: 'URL', value: '${url}' },
  { label: 'HTML', value: '<img src="${url}" alt="${filename}">' },
  { label: 'CSS', value: 'background: url("${url}") no-repeat;background-size: 100% 100%;' },
  { label: 'Markdown', value: '![${filename}](${url})' },
  { label: 'BBCode', value: '[img]${url}[/img]' },
  { label: 'UBB', value: '[IMG]${url}[/IMG]' },
  { label: 'custom', value: '[${filename}](${url})' }
])