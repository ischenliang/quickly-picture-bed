<template>
  <bytemd-editor
    class="bytemd-editor"
    :value="value"
    :mode="'auto'"
    :previewDebounce="300"
    :plugins="plugins"
    :placeholder="'请输入您的markdown内容....'"
    :locale="zh"
    :uploadImages="handleUpload"
    @change="handleChange" />
</template>
<script lang="ts" setup>
import 'bytemd/dist/index.css'
import zh from 'bytemd/locales/zh_Hans.json'
import gfm from '@bytemd/plugin-gfm'
import breaks from '@bytemd/plugin-breaks'
import formatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import zoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import { Editor as bytemdEditor } from '@bytemd/vue-next'
import { onMounted, ref, watch } from 'vue'
// 自定义主题菜单：https://blog.csdn.net/a114213077/article/details/129670069
import theme from './plugin-theme/index'
import useUserStore from '@/store/user'
import { useCtxInstance, useGetSuffix } from '@/hooks/global'
import Image from '@/types/Image'
import { BucketInter, ImageInter } from '@/typings/interface'
import Bucket from '@/types/Bucket'
import useConfigStore from '@/store/config'
import { PageResponse } from '@/typings/req-res'
import zhHans from './plugin-theme/zh_Hans.json'


/**
 * 实例
 */
const props = defineProps<{
  value: string
  markdownTheme: string
  codeTheme: string
}>()
const emit = defineEmits(['update:value', 'theme-change'])
const userStore = useUserStore()
const ctx = useCtxInstance()
const image = new Image()
const bucket = new Bucket()
const configStore = useConfigStore()

/**
 * 变量
 */
const plugins = ref([])


/**
 * 逻辑处理
 */
// 监听内容变化
function handleChange (value: string) {
  emit('update:value', value)
}
// 显示通知
function showNotify (message: string, type: string, duration: number = 1000) {
  ctx.$notify({
    title: '错误提示',
    message: message,
    type: type,
    duration: duration
  })
}
// 图片上传
async function handleUpload (e: File[]) {
  try {
    const { current_bucket: bucket_id } = userStore.user_habits.data
    const buckets = await bucket.find({ visible: true, is_only_names: true }) as PageResponse<BucketInter>
    const bucket_ids = buckets.items.map(el => el.id)
    const { system: { accept, maxcount, maxsize } } = configStore.systemConfig
    // 1、判断是否选择存储桶
    if (!bucket_id || !bucket_ids.includes(bucket_id)) {
      showNotify('请先选择存储桶，然后再上传', 'warning')
      return []
    }
    // 2、判断选择的文件是否超出系统限制
    if (maxcount < e.length) {
      showNotify('选择文件长度超出数量限制', 'warning')
      return []
    }
    // 3、判断上传的文件大小是否符合要求以及是否是接受的文件类型
    const errors = e.filter(file => {
      const fsize = file.size / 1024 / 1024
      return !accept.includes(useGetSuffix(file.name)) || fsize > maxsize
    }).map(el => {
      const fsize = el.size / 1024 / 1024
      const suffix = useGetSuffix(el.name)
      if (fsize > maxsize) {
        return `${el.name}大小${fsize.toFixed(2)}MB不符合要求`
      }
      if (!accept.includes(suffix)) {
        return `${el.name}格式${suffix}不符合要求`
      }
    })
    if (errors.length) {
      showNotify(errors.join(';'), 'error')
      return []
    }
    // 4、上传文件
    const files = e.filter(file => {
      const fsize = file.size / 1024 / 1024
      return accept.includes(useGetSuffix(file.name)) && fsize <= maxsize
    })
    showNotify('图片上传中，请勿操作...', 'warning')
    const formData = new FormData()
    formData.append('bucket_id', bucket_id.toString())
    files.forEach(file => {
      formData.append('files', file)
    })
    const imgs = await image.upload(formData, ({ loaded, total, percent }) => {}) as ImageInter[]
    showNotify('图片上传成功...', 'success')
    return imgs.map(img => {
      return {
        url: img.baseurl + img.url,
        name: img.name
      }
    })
  } catch (error) {
    showNotify('出错啦: ' + error, 'error')
  }
}


/**
 * 生命周期
 */
onMounted(() => {
  // 默认打开目录
  const rightToolbar = document.querySelector('.bytemd-toolbar-right') as HTMLDivElement
  if (rightToolbar) {
    const navigator = rightToolbar.querySelector('.bytemd-toolbar-icon') as HTMLDivElement
    navigator && navigator.click()
  }
})


/**
 * 主题变化时自动更新插件：为了将当前主题传递给插件列表
 */
watch(() => props.markdownTheme, (val) => {
  plugins.value = [
    gfm(),
    breaks(),
    formatter(),
    gemoji(),
    highlight(),
    zoom(),
    mermaid(),
    math(),
    theme({
      locale: {
        ...zhHans
      },
      theme: val,
      callback (theme: string) {
        emit('theme-change', theme)
      }
    })
  ]
}, {
  immediate: true
})
</script>
<style lang="scss">
.bytemd-editor {
  width: 100%;
  height: 100%;
  .bytemd {
    width: 100%;
    height: 100%;
    border: none !important;
    min-height: 300px !important;
  }
}
</style>