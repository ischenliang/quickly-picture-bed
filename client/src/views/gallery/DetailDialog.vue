<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'图片ID:' + detail.id"
    :width="'600px'"
    :before-close="handleClose">
    <div class="c-list">
      <div class="c-list-item">
        <span class="item-label">文件名：</span>
        <!-- <div>{{ detail.img_name }}</div> -->
        <el-input v-model="image_name" placeholder="请输入文件名称，可不带后缀">
          <template #append>
            <el-button @click="saveName">保存</el-button>
          </template>
        </el-input>
      </div>
      <div class="c-list-item">
        <span class="item-label">链&emsp;接：</span>
        <div style="width: 100%;">
          <el-select v-model="linkType" placeholder="Select" style="width: 110px" class="link-type-select">
            <el-option
              v-for="(item, index) in linkTypes"
              :key="index"
              :label="item.label"
              :value="item.label" />
          </el-select>
          <el-input :value="link" readonly class="special-input">
            <template #append>
              <el-button @click="handleClick">复制</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="c-list-item">
        <span class="item-label">位&emsp;置：</span><el-input v-model="detail.img_url" readonly />
      </div>
      <div class="c-list-item">
        <span class="item-label">存储桶：</span>
        <div>{{ detail.bucket_id }}({{ detail.bucket_type }})</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">哈希值：</span>
        <div>{{ detail.hash }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">尺&emsp;寸：</span>
        <div>宽 * 高 = {{ detail.img_width }} * {{ detail.img_height }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">大&emsp;小：</span>
        <div>{{ useFormatImageSize(detail.img_size) }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">类&emsp;型：</span>
        <div>{{ detail.mine_type }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">时&emsp;间：</span>
        <div>{{ detail.createdAt }}(创建)&emsp;&emsp;{{ detail.updatedAt }}(更新)</div>
      </div>
      <div class="c-list-item" style="flex-wrap: wrap;" v-if="showAlbum">
        <div style="display: flex;width: 100%;align-items: center;">
          <span class="item-label">关联相册：</span>
          <el-select v-model="album_id" style="width: 100%;" filterable class="album-select">
            <el-option
              v-for="(item, index) in albums"
              :key="index"
              :label="item.label"
              :value="item.value">
              <span>{{ item.label }}</span>
              <span style="font-size: 12px;margin-left: 10px;color: var(--el-text-color-secondary);">{{ item.desc }}</span>
            </el-option>
          </el-select>
          <el-button type="primary" @click="addAlbum">确定</el-button>
        </div>
        <p style="width: 100%;margin-top: 5px;color: var(--el-text-color-secondary);">选择相册后，点击加入相册按钮</p>
      </div>
    </div>
    <template #action>
      <el-button type="default" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="copyLink">复制</el-button>
      <!-- <el-button type="primary" @click="copyLink">设为头像</el-button> -->
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

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: ImageInter
  showAlbum?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as ImageInter),
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
const linkType = ref('URL')
// 名称
const image_name = ref(props.detail.img_name || '')

const link = computed({
  get () {
    const item = linkTypes.value.find(item => item.label === linkType.value)
    const { img_preview_url: url = '', img_name: filename = '' } = props.detail
    const obj = { url, filename }

    // 方式一：使用eval来替换
    // const tmp = item.value.replace(/\$\{/g, '${obj.')
    // return eval('`' + tmp + '`')

    // 方式二直接替换
    return item.value.replace(/\$\{(.*?)\}/g, (v, key) => {
      return obj[key]
    })
  },
  set (val) {

  }
})
const album_id = ref(props.detail.album_id || '')
const albums: Ref<Array<{ label: string, value: string, desc: string }>> = ref([])

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
  if (album_id.value !== props.detail.album_id || props.detail.img_name !== image_name.value) {
    emit('submit')
  }
}
// 打开链接
const openLink = () => {
  window.open(props.detail.img_preview_url, '_blank')
}
// 复制链接
const copyLink = () => {
  useCopyText(ctx, link.value)
  handleClose()
}
// 点击复制
const handleClick = () => {
  useCopyText(ctx, link.value)
}
// 获取相册列表
const getAlbums = () => {
  album.find({}).then((res: PageResponse<AlbumInter, { id: string, count: number }>) => {
    albums.value = res.items.map(item => {
      return {
        label: item.name,
        value: item.id,
        desc: item.desc
      }
    })
  })
}
getAlbums()
// 相册下拉回调
const addAlbum = () => {
  image.update({
    id: props.detail.id,
    album_id: album_id.value,
    slient: true
  }).then(res => {
    ctx.$message({ message: '加入相册成功', duration: 1000, type: 'success' })
  })
}
// 保存名称
const saveName = () => {
  image.update({
    id: props.detail.id,
    img_name: image_name.value,
    slient: true
  }).then(res => {
    ctx.$message({ message: '名称修改成功', duration: 1000, type: 'success' })
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
  }
}
</style>