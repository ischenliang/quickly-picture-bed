<template>
  <div class="custom-card-box">
    <div class="custom-card-album">
      <el-tooltip effect="dark" content="将图片上传到指定相册中" placement="right">
        <el-select
          v-model="albumData.active_id"
          placeholder="相册选择"
          style="width: 180px;"
          popper-class="album-select-popper"
          @change="toggleCurrentBucket(albumData.active_id)">
          <el-option
            v-for="(item, index) in albumData.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <p class="title">{{ item.name }}</p>
            <p class="desc">{{ item.desc }}</p>
          </el-option>
        </el-select>
      </el-tooltip>
    </div>
    <div class="custom-card-upload">
      <div class="custom-upload-loading" v-if="totalProgress.progress">
        <img src="/loading.gif" alt="">
        <p>
          <span v-if="totalProgress.progress < 100">正在上传图片...</span>
          <span v-if="totalProgress.progress === 100">正在将图片转存到存储桶...</span>
        </p>
      </div>
      <!-- 上传区 -->
      <c-upload
        :accept="systemConfig.system.accept"
        :limit="systemConfig.system.maxcount"
        :multiple="$route.query.img_id ? false : systemConfig.system.maxcount > 1"
        @upload="beforeUpload">
        <template #progress v-if="totalProgress.progress">
          <el-progress :percentage="totalProgress.progress" />
        </template>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          <p>点击上传图片，支持拖拽上传</p>
          <p>支持同时上传最多 {{ systemConfig.system.maxcount }} 张图片，单个文件最大 {{ systemConfig.system.maxsize }} MB</p>
        </div>
        <template #tip>
          <div class="c-upload__tip">
            大小不超过
            <span>{{ systemConfig.system.maxsize }}MB</span>
            的
            <span>{{ systemConfig.system.accept.join(', ') }}</span>
            文件,
            <span>支持直接 Ctrl + V 上传</span>
          </div>
        </template>
        <template #action>
          <div class="entry-title">快捷上传: </div>
          <el-tooltip effect="dark" content="如果不支持，可以尝试直接按Ctrl + V" placement="bottom">
            <div class="btn-link btn-link-clip" @click="entryUpload('clipboard')">
              <el-icon><Edit /></el-icon>剪切板上传
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="将网络图片保存到系统中" placement="bottom">
            <div class="btn-link btn-link-network" @click="entryUpload('url')">
              <el-icon><Connection /></el-icon>URL远程上传
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="将Base64编码的图片保存到系统中" placement="bottom">
            <div class="btn-link btn-link-base64" @click="entryUpload('base64')">
              <el-icon><HelpFilled /></el-icon>Base64上传
            </div>
          </el-tooltip>
        </template>
      </c-upload>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCtxInstance, useDocumentClipboard, useGetSuffix, useWindowClipboard, useUrlToImageFile } from '@/hooks/global';
import { AlbumInter, HabitsInter, ImageInter } from '@/typings/interface';
import { computed, onBeforeUnmount, onMounted, reactive, ref, Ref, watch } from 'vue';
import useConfigStore from '@/store/config'
import cUpload from '@/components/web/upload/index.vue'
import Image from '@/types/Image';
import { PageResponse } from '@/typings/req-res';
import useUserStore from '@/store/user';
import { ElMessageBox } from 'element-plus';
import { useFileName } from '@/hooks/date-time';
import Album from '@/types/Album';
import Habits from '@/types/Habits';
import { useRoute } from 'vue-router';
interface Props {
  userHabits: HabitsInter
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
const album = new Album()
const habit = new Habits()
const route = useRoute()
const { album_id, img_id } = route.query

/**
 * 变量
 */
const habits = computed({
  get: () => props.userHabits,
  set: (val) =>  emit('update:userHabits', val)
})
// 系统配置
const systemConfig = computed(() => {
  const config = configStore.systemConfig
  config.system.accept_str = '.' + config.system.accept.join(',.')
  return config
})
// 进度统计
const totalProgress: {
  progress: number
} = reactive({
  progress: 0
})
// 相册列表
const albumData: {
  active_id: number
  data: AlbumInter[]
} = reactive({
  active_id: album_id ? parseInt(album_id as string) : habits.value.current_album, // 当前勾选相册id
  data: []
})

/**
 * 逻辑处理
*/
// 文件上传前对文件大小限制
const beforeUpload = (e: { files: File[], error: string }) => {
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
  }
  totalProgress.progress = 0
  upload(fileList, errorList)
}
// 上传
const upload = (fileList: File[], errorList: File[] = []) => {
  const bucket_id = habits.value.current_bucket
  // 1、判断是否勾选存储桶，并且当前存储桶存在于存储桶列表中
  const buckets = userStore.user_buckets.map(el => el.id)
  if (!buckets.length) {
    return ctx.$message({ message: '请先创建存储桶', duration: 1000, type: 'warning' })
  }
  if (!bucket_id || !buckets.includes(bucket_id)) {
    return ctx.$message({ message: '请先选择存储桶，然后再上传', duration: 1000, type: 'warning' })
  }
  showError(errorList)
  // 2、处理请求体
  const formData = new FormData()
  formData.append('bucket_id', bucket_id.toString())
  if (img_id) {
    formData.append('image_id', img_id.toString())
  }
  if (albumData.active_id) {
    formData.append('album_id', albumData.active_id.toString())
  }
  fileList.forEach(el => {
    formData.append('files', el)
  })
  // 3、上传文件
  image.upload(formData, ({ loaded, total, percent }) => {
    totalProgress.progress = percent
  }).then((res: ImageInter[]) => {
    ctx.$message({ message: '上传成功', duration: 1000, type: 'success' })
    emit('success')
    res.forEach(el => {
      el.preview_url = el.baseurl + el.url
      const idx = userStore.currentImages.findIndex(img => img.id === el.id)
      if (img_id || idx !== -1) {
        userStore.currentImages.splice(idx, 1, el)
      } else {
        userStore.currentImages.push(el)
      }
    })
  }).catch(error => {
    ctx.$notify({
      title: '插件运行错误提示',
      message: error.data,
      type: 'error',
      duration: 1000
    })
  }).finally(() => {
    totalProgress.progress = 0
  })
}
// 处理快捷上传的文件
function handleFiles (files: File[]) {
  if (files.length === 0) {
    return
  }
  if (files.length >= systemConfig.value.system.maxcount) {
    return ctx.$message({
      message: '上传文件长度超出数量限制',
      duration: 1000,
      type: 'error'
    })
  } else {
    beforeUpload({ files: files, error: '' })
  }
}
// 粘贴板上传文件：ctrl + v
const clipboard = (event) => {
  useDocumentClipboard(event).then((files: File[]) => {
    handleFiles(files)
  })
}
// 快捷上传
const entryUpload = (type: string) => {
  // 点击读取粘贴板的文件并上传
  if (type === 'clipboard') {
    useWindowClipboard().then((files: File[]) => {
      handleFiles(files)
    }).catch(error => {
      ctx.$message({ message: error.message, type: 'error', duration: 1000 })
    })
  }
  if (type === 'url') {
    ElMessageBox.prompt('请输入网络图片url', '网络图片上传', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请输入图片url'
    }).then(({ value }) => {
      useUrlToImageFile(value, useFileName() + '.png', systemConfig.value.system.accept).then((res: File) => {
        handleFiles([res])
      }).catch(error => {
        ctx.$notify({
          title: '错误提示',
          message: error.message,
          type: 'error',
          duration: 1000
        })
      })
    }).catch(() => {})
  }
  if (type === 'base64') {
    ElMessageBox.prompt('请输入图片的base64编码内容', 'Bas64图片上传', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请输入图片的base64编码内容'
    }).then(({ value }) => {
      // 1、将 base64 字符串解码为字节数组（Uint8Array）
      const bytes = atob(value.replace(/^data:.+;base64,/, '')) // 得去掉前缀
      const byteArray = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i);
      }
      // 2、创建 Blob 对象
      const blob = new Blob([byteArray], { type: 'image/jpeg' }); // 替换成相应的 MIME 类型
      // 3、创建File对象
      const file = new File([blob], useFileName() + '.png', { type: 'image/png' }); // 替换成相应的文件名和 MIME 类型
      handleFiles([file])
    }).catch(() => {})
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
    albumData.data = [
      { id: 0, name: '图库', desc: '不放进任何相册中' },
      ...res.items
    ]
  })
}
getAlbums()
// 切换当前图床
const toggleCurrentBucket = async (item: number) => {
  habits.value.current_album = item
  await habit.save({
    id: habits.value.id,
    current_album: item
  })
}


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
  if (val !== 0) {
    console.log('总进度：', totalProgress.progress)
  }
}, {
  deep: true
})
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.custom-card {
  .custom-card-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    .custom-card-upload {
      display: flex;
      position: relative;
      .c-upload {
        flex: 1;
      }
    }
    .custom-upload-loading {
      position: absolute;
      top: 20px;
      left: 0;
      height: calc(100% - 20px);
      width: 100%;
      background: rgba($color: #000000, $alpha: 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      border-radius: 6px;
      img {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
      }
      p {
        font-size: 20px;
        color: #fff;
      }
    }
  }
}
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
  &__tip {
    span {
      color: var(--el-color-success);
      font-weight: bold;
    }
  }
}
.entry-title {
  font-size: 14px;
  margin-right: 5px;
}
.btn-link {
  height: 100%;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  .el-icon {
    margin-right: 3px;
    font-size: 15px;
  }
  &-clip {
    color: var(--el-color-success);
    &:hover {
      background: var(--el-color-success-light-9);
    }
  }
  &-network {
    color: var(--el-color-warning);
    &:hover {
      background: var(--el-color-warning-light-9);
    }
  }
  &-base64 {
    color: var(--el-color-primary);
    &:hover {
      background: var(--el-color-primary-light-9);
    }
  }
}
.album-select-popper {
  max-width: 250px;
  .el-select-dropdown__item {
    height: auto !important;
    margin-bottom: 5px;
    .desc {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      line-height: 24px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .title {
      line-height: 30px;
      font-weight: bold;
      display: flex;
      font-size: 15px;
      align-items: center;
      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>