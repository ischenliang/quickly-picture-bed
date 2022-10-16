<template>
  <c-upload
    :accept="['png', 'jpg', 'gif', 'jpeg', 'webp']"
    @upload="beforeUpload">
    <template #progress v-if="totalProgress.percent">
      <el-progress :percentage="totalProgress.percent" />
    </template>
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      点击上传图片，支持拖拽上传
    </div>
    <template #tip>
      <div class="el-upload__tip">大小不超过10MB的png, jpg, gif文件</div>
    </template>
  </c-upload>
  <div class="quick-entry">
    <div class="entry-title">快捷上传</div>
    <div class="entry-list">
      <el-button type="primary">剪切板图片</el-button>
      <el-button type="primary" @click="handleClick">网络图URL</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCopyText, useCtxInstance } from '@/hooks/global';
import { HabitsInter, ImageInter } from '@/typings/interface';
import { computed, reactive, ref, Ref, watch } from 'vue';
import { linkTypes, Link } from '@/global.config'
import useAppStore from '@/store/app'
import cUpload from '@/components/web/upload/index.vue'
import bucketUpload from '@/hooks/bucket/index';
import Image from '@/types/Image';
import { JsonResponse } from '@/typings/req-res';
import useUserStore from '@/store/user';
interface Props {
  userHabits: HabitsInter
}
interface Progress {
  [prop: string | number]: {
    loaded: number
    total: number
  }
}
/**
 * 实例
 */
const ctx = useCtxInstance()
const props = withDefaults(defineProps<Props>(), {
  userHabits: () => ({
    link_format: 'URL'
  } as HabitsInter)
})
const emit = defineEmits(['update:userHabits'])
const appStore = useAppStore()
const userStore = useUserStore()
const image = new Image()

/**
 * 变量
 */
const habits = computed({
  get: () => props.userHabits,
  set: (val) =>  emit('update:userHabits', val)
})
// 当前上传图片
const current = computed({
  get: () => userStore.currentImage,
  set: (val) => userStore.currentImage = val
})
// 系统配置
const systemConfig = computed(() => {
  const config = appStore.systemConfig.config
  config.upload.accept_str = '.' + config.upload.accept.join(',.')
  return config
})
// 进度统计
const totalProgress: {
  progress: Progress
  percent: number
  total: number
  loaded: number
} = reactive({
  progress: {},
  percent: 0,
  total: 0,
  loaded: 0
})

/**
 * 逻辑处理
*/
// 复制链接地址
const handleClick = () => {
  const tmp = linkTypes.value.find(item => {
    return item.label === habits.value.link_format
  })
  useCopyText(ctx, getLinkValue(tmp))
}
// 获取指定类型的链接地址
const getLinkValue = (item: Link) => {
  // 方式二：eval替换
  const obj = {
    url: current.value.img_url,
    filename: current.value.img_name
  }
  const tmp = item.value.replace(/\$\{/g, '${obj.')
  return eval('`' + tmp + '`')
}
// 文件上传前对文件大小限制
const beforeUpload = (e: { files: FileList, error: string }) => {
  if (e.error) {
    return ctx.$message({ message: e.error, duration: 1000, type: 'error' })
  }
  // 这里做文件大小限制：超出限制的文件不允许上传
  const fileList = [] // 满足条件的文件
  const errorList = [] // 不满足条件的文件
  for (let i = 0; i < e.files.length; i++) {
    const file: File = e.files[i]
    const fsize = file.size / 1024 / 1024
    if (fsize < systemConfig.value.upload.maxsize) {
      fileList.push(file)
    } else {
      errorList.push(file)
    }
    totalProgress.progress[i] = { loaded: 0, total: file.size }
    upload(fileList)
  }
}
// 上传
const upload = (fileList: File[]) => {
  const { type, id } = habits.value.current
  if (type === '' || id === '') {
    return ctx.$message({ message: '请先选择存储桶，然后再上传', duration: 1000, type: 'warning' })
  }
  bucketUpload[type].uploadFile(id, fileList, ({ loaded, index, total }) => {
    totalProgress.progress[index].loaded = loaded
    totalProgress.progress[index].total = total
  }).then((res: Array<ImageInter>) => {
    totalProgress.percent = 0
    res.forEach((item, index) => {
      image.create({
        ...item,
        bucket_id: id,
        bucket_type: type
      }).then((result: JsonResponse<ImageInter>) => {
        if (index === res.length - 1) {
          ctx.$message({ message: '上传成功', duration: 1000, type: 'success' })
          result.data.img_preview_url = habits.value.current.config_baseUrl + result.data.img_url
          current.value = result.data
        }
      })
    })
  })
}

/**
 * 监听器
 */
watch(() => totalProgress.progress, (val) => {
  totalProgress.loaded = 0
  totalProgress.total = 0
  for(let key in val) {
    if (val[key].loaded !== 0) {
      totalProgress.loaded += val[key].loaded
    }
    totalProgress.total += val[key].total
  }
  totalProgress.percent = parseFloat(((totalProgress.loaded / totalProgress.total) * 100).toFixed(2))
  console.log('总进度：', totalProgress.percent + '%', totalProgress.loaded, totalProgress.total)
}, {
  deep: true
})
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.custom-card {
  .el-card__body {
    @include flex-layout(row);
  }
  .c-upload {
    height: 300px;
  }
  .quick-entry {
    // margin-top: 15px;
    flex-shrink: 0;
    margin-left: 15px;
    @include flex-layout-align(column, flex-start, center);
    .entry-title {
      font-size: 16px;
      margin-bottom: 15px;
    }
    .entry-list {
      @include flex-layout(column);
      .el-button {
        + .el-button {
          margin-left: 0;
          margin-top: 12px;
        }
      }
    }
  }
}
</style>