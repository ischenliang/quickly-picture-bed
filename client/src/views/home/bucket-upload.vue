<template>
  <div class="custom-card-box">
    <div class="custom-card-album">
      <el-tooltip effect="dark" content="将图片上传到指定相册中" placement="right">
        <el-select
          v-model="albumData.active_id"
          placeholder="相册选择"
          style="width: 180px;"
          @change="toggleCurrentBucket(albumData.active_id)">
          <el-option
            v-for="(item, index) in albumData.data"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </el-tooltip>
    </div>
    <div class="custom-card-upload">
      <!-- 上传区 -->
      <c-upload
        :accept="systemConfig.system.accept"
        :limit="systemConfig.system.maxcount"
        :multiple="systemConfig.system.maxcount > 1"
        @upload="beforeUpload">
        <template #progress v-if="totalProgress.percent">
          <el-progress :percentage="totalProgress.percent" />
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
          <el-tooltip effect="dark" content="将网络图片保存到系统中" placement="bottom">
            <div class="btn-link btn-link-base64" @click="entryUpload('url')">
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
import { useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { useFileName } from '@/hooks/date-time';
import Album from '@/types/Album';
import Habits from '@/types/Habits';
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
const album = new Album()
const habit = new Habits()

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
  active_id: number
  data: AlbumInter[]
} = reactive({
  active_id: ctx.$route.query.album_id || habits.value.current_album, // 当前勾选相册id
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
  const id = habits.value.current_bucket
  console.log(fileList)
  // @ts-ignore
  showError(errorList)
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
    albumData.data = [
      { id: 0, name: '图库' },
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
  .custom-card-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    .custom-card-upload {
      display: flex;
      .c-upload {
        flex: 1;
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
      color: #0db3a6;
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
    color: #0db3a6;
    &:hover {
      background: #e7f7f8;
    }
  }
  &-network {
    color: #E7826D;
    &:hover {
      background: #fdf6ec;
    }
  }
  &-base64 {
    color: #386af1;
    &:hover {
      background: #ecf5ff;
    }
  }
}
</style>