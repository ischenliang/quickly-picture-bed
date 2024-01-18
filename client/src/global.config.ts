import { ref, Ref } from 'vue';
import { HabitsInter } from './typings/interface';
export const user_habits: HabitsInter = {
  shortKey: [
    { label: '快捷上传', key: 'upload', value: 'Command + Shift + P', id: 1 }
  ],
  showUpdateTip: true,
  showCopyTip: true,
  showDeleteTip: true,
  rename: false,
  autoRename: true,
  autoPaste: true,
  pasteStyle: 'markdown',
  current: {},
  link_format: 'URL',
}


export interface Link {
  label: string
  value: string
  id: string
}

// 链接类型列表
// 占位符$url：表示图片的url地址
// 占位符$filename：表示文件名
export const linkTypes: Ref<Link[]> = ref([
  { label: 'URL', value: '${url}', id: 'url' },
  { label: 'HTML', value: '<img src="${url}" alt="${filename}">', id: 'html' },
  { label: 'CSS', value: 'background: url("${url}") no-repeat;background-size: 100% 100%;', id: 'css' },
  { label: 'Markdown', value: '![${filename}](${url})', id: 'markdown' },
  { label: 'MD-Link', value: '[![${filename}](${url})](${url})', id: 'md-link' },
  { label: 'BBCode', value: '[img]${url}[/img]', id: 'bbcode' },
  { label: 'UBB', value: '[IMG]${url}[/IMG]', id: 'ubb' },
  { label: 'Custom', value: '[${filename}](${url})', id: 'custom' }
])


// 常见文件的mine-type类型
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

// @ts-ignore
const ip = window.uploader_ip
window.uploader_ip = ip
export const baseURL = ip ? `${ip}/api/v1` : `/api/v1`
