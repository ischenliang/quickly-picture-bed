<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'图片ID:' + id"
    :width="'600px'"
    :before-close="handleClose">
    <p style="color: red">修改值后请点击"保存"按钮</p>
    <div class="c-list" v-if="form.url">
      <div class="c-list-item">
        <span class="item-label">原名称：</span>
        <div>{{ form.origin_name }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">文件名：</span>
        <div>{{ form.name }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">链&emsp;接：</span>
        <div style="width: 100%;">
          <el-select v-model="linkType" @change="handleLink" placeholder="Select" style="width: 110px" class="link-type-select">
            <el-option
              v-for="(item, index) in linkTypes"
              :key="index"
              :label="item.label"
              :value="item.id" />
          </el-select>
          <el-input :value="link" readonly class="special-input">
            <template #append>
              <el-button @click="handleClick">复制</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="c-list-item">
        <span class="item-label">位&emsp;置：</span><el-input v-model="form.url" readonly />
      </div>
      <div class="c-list-item">
        <span class="item-label">存储桶：</span>
        <div>{{ form.bucket_id }}({{ form.bucket_id }})</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">哈希值：</span>
        <div>{{ form.hash }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">尺&emsp;寸：</span>
        <div>宽 * 高 = {{ form.width }} * {{ form.height }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">大&emsp;小：</span>
        <div>{{ useFormatImageSize(form.size) }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">类&emsp;型：</span>
        <div>{{ form.mime_type }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">时&emsp;间：</span>
        <div>{{ useFormatTime(form.createdAt) }}(创建)&emsp;&emsp;{{ useFormatTime(form.updatedAt) }}(更新)</div>
      </div>
      <div class="c-list-item" v-if="showAlbum">
        <span class="item-label">所属相册：</span>
        <el-select v-model="form.album_id" style="width: 100%;" filterable popper-class="album-select-popper" @change="handleChangeAlbum">
          <el-option
            v-for="(item, index) in albums"
            :key="index"
            :label="item.label"
            :value="item.value">
            <p class="title">{{ item.label }}</p>
            <p class="desc">{{ item.desc }}</p>
          </el-option>
        </el-select>
      </div>
    </div>
    <template #action>
      <el-button type="default" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="copyLink">复制</el-button>
      <el-button type="success" @click="openLink">打开链接</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { AlbumInter, ImageInter } from '@/typings/interface';
import { computed, Ref, ref } from 'vue';
import { useCopyText, useCtxInstance, useFormatImageSize } from '@/hooks/global'
import { linkTypes } from '@/global.config';
import Album from '@/types/Album';
import { PageResponse } from '@/typings/req-res';
import Image from '@/types/Image';
import { useFormatTime } from '@/typings/date-time';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  id: number
  showAlbum?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  id: 0,
  showAlbum: true
})
const emit = defineEmits(['update:modelValue', 'submit'])
const ctx = useCtxInstance()
const album = new Album()
const image = new Image()

/**
 * 变量
 */
const dialogVisible = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})
const form: Ref<ImageInter> = ref({
  id: 0,
  name: ''
})
const linkType = ref('url')
// 链接类型
const link = ref('')
// 相册列表
const albums: Ref<Array<{ label: string, value: number, desc: string }>> = ref([])

/**
 * 回调函数
 */
function handleClose () {
  dialogVisible.value = false
}
// 处理链接地址
function handleLink () {
  const item = linkTypes.value.find(item => item.id === linkType.value)
  const { preview_url: url = '', name: filename = '' } = form.value
  const obj = { url, filename }
  // 方式二直接替换
  link.value = item.value.replace(/\$\{(.*?)\}/g, (v, key) => {
    return obj[key]
  })
}
// 相册详情
function getDetail () {
  image.detail(props.id).then((res: ImageInter) => {
    form.value = res
    form.value.preview_url = form.value.baseurl + form.value.url
    handleLink()
  })
}
getDetail()
// 点击复制
function handleClick () {
  useCopyText(ctx, link.value)
}
// 复制链接
function copyLink () {
  useCopyText(ctx, link.value)
  handleClose()
}
// 打开链接
function openLink () {
  window.open(form.value.preview_url, '_blank')
}
// 获取相册列表
function getAlbums () {
  album.find({}).then((res: PageResponse<AlbumInter, { id: string, count: number }>) => {
    albums.value = [
      { label: '图库', value: null, desc: '不放进任何相册中' },
      ...res.items.map(item => {
        return {
          label: item.name,
          value: item.id,
          desc: item.desc
        }
      })
    ]
  })
}
getAlbums()
// 保存名称
function handleChangeAlbum () {
  image.update({
    id: props.id,
    album_id: form.value.album_id
  }).then(res => {
    // ctx.$message({ message: '修改成功', duration: 1000, type: 'success' })
  })
}
</script>

<style lang="scss">
.c-list {
  border: 1px solid #dcdee2;
  border-radius: 6px;
  margin-bottom: 16px;
  .c-list-item {
    padding-right: 16px;
    padding-left: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    color: #747a80;
    min-height: 49px;
    + .c-list-item {
      border-top: 1px solid #e8eaec;
    }
    .item-label {
      flex-shrink: 0;
    }
    .el-select.link-type-select {
      .el-input__wrapper {
        border-radius: 4px 4px 0 0;
      }
    }
    .special-input {
      margin-top: -1px;
      .el-input__wrapper {
        border-radius: 0 0 0 4px;
      }
    }
    .el-input__inner {
      text-align: left;
    }
  }
}
.album-select-popper {
  .el-select-dropdown__item {
    height: auto !important;
    margin-bottom: 5px;
    .desc {
      font-size: 14px;
      color: #999;
      line-height: 24px;
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