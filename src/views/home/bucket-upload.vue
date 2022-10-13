<template>
  <!-- :auto-upload="false" -->
  <el-upload
    class="upload"
    drag
    :limit="systemConfig.upload.maxcount"
    :accept="systemConfig.upload.accept_str"
    :show-file-list="false"
    multiple
    :on-change="onChange"
    :file-list="files"
    :auto-upload="false"
    action="#">
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      点击上传图片，支持拖拽上传
    </div>
    <el-button @click.stop="save" :disabled="files.length === 0">保存</el-button>
    <template #tip>
      <div class="el-upload__tip">大小不超过10MB的png, jpg, gif文件</div>
    </template>
  </el-upload>
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
import { computed, ref, Ref } from 'vue';
import { linkTypes, Link } from '@/global.config'
import useAppStore from '@/store/app'
import leancloud from '@/hooks/bucket/leancloud'
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
const emit = defineEmits(['update:userHabits'])
const appStore = useAppStore()

/**
 * 变量
 */
const habits = computed({
  get: () => props.userHabits,
  set: (val) =>  emit('update:userHabits', val)
})
// 当前上传图片
const current: Ref<ImageInter> = ref({
  id: 'abcd',
  img_url: 'http://img.itchenliang.club/img/509036ffc9a69659.png',
  img_size: 200,
  img_height: 600,
  img_width: 400,
  img_name: '509036ffc9a69659.png'
})
// 系统配置
const systemConfig = computed(() => {
  const config = appStore.systemConfig.config
  config.upload.accept_str = '.' + config.upload.accept.join(',.')
  return config
})
// 文件列表
const files = ref([])


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
// 选择文件后触发
const onChange = (file, fileList: Array<{ name: string, raw: File }>) => {
  files.value = fileList.map(item => item.raw)
}

const save = () => {
  leancloud.uploadFile('6343d452cd84e144d59c9150', files.value)
    .then(res => {
      console.log(res)
    })
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.custom-card {
  .el-card__body {
    @include flex-layout(row);
  }
  .upload {
    height: 300px;
    flex: 1;
    @include flex-layout(column);
    .el-upload {
      flex: 1;
      .el-upload-dragger {
        height: 100%;
        @include flex-layout-align(column, center, center);
      }
    }
    .el-upload__tip {
      flex-shrink: 0;
    }
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