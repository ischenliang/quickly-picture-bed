<template>
  <div class="custom-card-album">
    <el-tooltip effect="dark" content="将图片上传到指定相册中" placement="right">
      <el-select v-model="albumData.active_id" placeholder="相册选择" style="width: 180px;">
        <el-option
          v-for="(item, index) in albumData.data"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>
    </el-tooltip>
  </div>
  <div class="custom-card-upload">
    <c-upload
      :accept="systemConfig.system.accept"
      :limit="systemConfig.system.maxcount"
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
        <div class="el-upload__tip">大小不超过{{ systemConfig.system.maxsize }}MB的{{ systemConfig.system.accept.join(', ') }}文件，<span style="color: red;">支持直接 Ctrl + V 上传</span></div>
      </template>
    </c-upload>
    <div class="quick-entry">
      <div class="entry-title">快捷上传</div>
      <div class="entry-list">
        <el-tooltip effect="dark" content="如果不支持，可以尝试直接按Ctrl + V" placement="left">
          <el-button type="primary" @click="entryUpload('clipboard')">剪切板图片</el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="将网络图片保存到系统中" placement="left">
          <el-button type="primary" @click="entryUpload('url')">网络图URL</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCopyText, useCtxInstance, useDocumentClipboard, useGetSuffix, useWindowClipboard, useUrlToImageFile } from '@/hooks/global';
import { AlbumInter, HabitsInter, ImageInter } from '@/typings/interface';
import { computed, onBeforeUnmount, onMounted, reactive, ref, Ref, watch } from 'vue';
import { linkTypes, Link } from '@/global.config'
import useConfigStore from '@/store/config'
import cUpload from '@/components/web/upload/index.vue'
import bucketUpload from '@/hooks/bucket/index';
import Image from '@/types/Image';
import { JsonResponse, PageResponse } from '@/typings/req-res';
import useUserStore from '@/store/user';
import { useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { useFileName } from '@/hooks/date-time';
import UploadManager from '@/hooks/uploader';
import Album from '@/types/Album';
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
const emit = defineEmits(['update:userHabits', 'success'])
const configStore = useConfigStore()
const userStore = useUserStore()
const image = new Image()
const route = useRoute()
const uploader = new UploadManager()
const album = new Album()

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
  const config = configStore.systemConfig
  config.system.accept_str = '.' + config.system.accept.join(',.')
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
// 相册列表
const albumData: {
  active_id: string
  data: AlbumInter[]
} = reactive({
  active_id: ctx.$route.query.album_id, // 当前勾选相册id
  data: []
})

/**
 * 逻辑处理
*/
// 文件上传前对文件大小限制
const beforeUpload = (e: { files: FileList, error: string }) => {
  // console.log(e)
  if (e.error) {
    return ctx.$message({ message: e.error, duration: 1000, type: 'error' })
  }
  // 这里做文件大小限制：超出限制的文件不允许上传
  const fileList = [] // 满足条件的文件
  const errorList = [] // 不满足条件的文件
  for (let i = 0; i < e.files.length; i++) {
    const file: File = e.files[i]
    const fsize = file.size / 1024 / 1024 // 单位换算成MB
    const suffix = useGetSuffix(file.name)
    const system = systemConfig.value.system
    // 尺寸符合规范于此同时类型也需要符合规范
    if (fsize < system.maxsize && system.accept.includes(suffix)) {
      fileList.push(file)
    } else {
      errorList.push(file)
    }
    totalProgress.progress[i] = { loaded: 0, total: file.size }
  }
  upload(fileList, errorList)
}
// 上传
const upload = (fileList: File[], errorList: File[] = []) => {
  const { id, type } = habits.value.current
  if (!id || !type || type === '' || id === '') {
    return ctx.$message({ message: '请先选择存储桶，然后再上传', duration: 1000, type: 'warning' })
  }
  showError(errorList)

  uploader.uploadFile(id, fileList, ({ loaded, index, total }) => {
    totalProgress.progress[index].loaded = loaded
    totalProgress.progress[index].total = total
  }).then((res: Array<ImageInter>) => {
    totalProgress.percent = 0
    res.forEach((item, index) => {
      let tmp = {
        ...item,
        bucket_id: id,
        bucket_type: type
      }
      if (albumData.active_id) {
        tmp.album_id = albumData.active_id
      }
      // 判断是否传img_id，传了代表更新数据
      if (route.query.img_id) {
        delete tmp.img_name
        image.update({
          id: route.query.img_id as string,
          ...tmp,
          slient: true
        }).then((result: ImageInter) => {
          if (index === res.length - 1) {
            ctx.$message({ message: '上传成功', duration: 1000, type: 'success' })
            result.img_preview_url = habits.value.current.config_baseUrl + result.img_url
            current.value = result
            emit('success')
          }
        })
      } else {
        image.create({
          ...tmp
        }).then((result: ImageInter) => {
          if (index === res.length - 1) {
            ctx.$message({ message: '上传成功', duration: 1000, type: 'success' })
            result.img_preview_url = habits.value.current.config_baseUrl + result.img_url
            current.value = result
            emit('success')
            // totalProgress.progress = {}
          }
        })
      }
    })
  })
}

// 粘贴板上传文件：ctrl + v
const clipboard = (event) => {
  useDocumentClipboard(event).then((files: File[]) => {
    files.forEach((file, index) => {
      totalProgress.progress[index] = { loaded: 0, total: file.size }
    })
    files.length && upload(files)
  })
}
// 快捷上传
const entryUpload = (type: string) => {
  // 点击读取粘贴板的文件并上传
  if (type === 'clipboard') {
    useWindowClipboard().then((files: File[]) => {
      files.forEach((file, index) => {
        totalProgress.progress[index] = { loaded: 0, total: file.size }
      })
      files.length && upload(files)
    }).catch(error => {
      ctx.$message({ message: error.message, type: 'error', duration: 1000 })
    })
  }
  if (type === 'url') {
    ElMessageBox.prompt('请输入网络图片url', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(({ value }) => {
      useUrlToImageFile(value, useFileName() + '.png', systemConfig.value.system.accept).then((res: File) => {
        totalProgress.progress[0] = { loaded: 0, total: res.size }
        upload([res])
      }).catch(error => {
        ctx.$notify({
          title: '错误提示',
          message: error.message,
          type: 'error',
          duration: 1000
        })
      })
    })
  }
}
// 提示错误信息
const showError = (errList: File[]) => {
  errList.forEach(item => {
    // 解决重叠问题：https://blog.csdn.net/csdn_yudong/article/details/101271214
    const system = configStore.systemConfig.system
    setTimeout(() => {
      let msg = ''
      const fsize = item.size / 1024 / 1024 // 单位换算成MB
      const suffix = useGetSuffix(item.name)
      if (fsize > system.maxsize) {
        msg += `${item.name}大小${fsize.toFixed(2)}MB不符合要求`
      }
      if (!system.accept.includes(suffix)) {
        msg += `${item.name}格式${suffix}不符合要求`
      }
      ctx.$notify({
        title: '错误提示',
        message: msg,
        type: 'error',
        duration: 1000
      })
    }, 0)
  })
}
// 获取相册列表
function getAlbums () {
  album.find({
    sort: 'sort',
    order: 'desc'
  }).then((res: PageResponse<AlbumInter, { id: string, count: number }>) => {
    albumData.data = res.items
  })
}
getAlbums()


/**
 * 生命周期
 */
onMounted(() => {
  document.addEventListener('paste', clipboard)
})
onBeforeUnmount(() => {
  document.removeEventListener('paste', clipboard)
})

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
    display: flex;
    flex-direction: column;
    .custom-card-album {
      margin-bottom: 8px;
    }
    .custom-card-upload {
      @include flex-layout(row);
    }
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