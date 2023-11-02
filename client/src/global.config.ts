import { ref, Ref } from 'vue';
import { HabitsInter } from './typings/interface';
export const user_habits: HabitsInter = {
  shortKey: [
    { label: '快捷上传', key: 'upload', value: 'Command + Shift + P', id: 1 }
  ],
  showTip: {
    copy: true,
    delete: true,
    update: true,
    upload: true
  },
  rename: false,
  autoRename: true,
  autoPaste: true,
  pasteStyle: 'markdown',
  current_bucket: 0,
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
  { label: '链接(URL)', value: '${url}', id: 'url' },
  { label: 'HTML', value: '<img src="${url}" alt="${filename}">', id: 'html' },
  { label: 'CSS', value: 'background: url("${url}") no-repeat;background-size: 100% 100%;', id: 'css' },
  { label: 'Markdown', value: '![${filename}](${url})', id: 'markdown' },
  { label: '超链接图片', value: '[![${filename}](${url})](${url})', id: 'md-link' },
  { label: '论坛代码', value: '[img]${url}[/img]', id: 'bbcode' },
  { label: 'UBB', value: '[IMG]${url}[/IMG]', id: 'ubb' },
  { label: '自定义', value: '[${filename}](${url})', id: 'custom' }
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


// 124.222.54.192
// @ts-ignore
const ip = window.uploader_ip || import.meta.env.VITE_APP_BASE_URL
window.uploader_ip = ip
export const baseURL = `${ip}/v1`


export const PluginLoadUrl = 'https://unpkg.com/'
export const npmRegistry = 'https://registry.npmjs.org'


export const authorConfig = {
  email: 'itchenliang@163.com'
}