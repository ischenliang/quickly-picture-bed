<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="'图片ID:' + detail.id"
    :width="'550px'"
    :before-close="handleClose">
    <div class="c-list">
      <div class="c-list-item">
        <span class="item-label">文件名：</span>
        <div>{{ detail.img_name }}</div>
      </div>
      <div class="c-list-item">
        <span class="item-label">链&emsp;接：</span>
        <div style="width: 100%;">
          <el-select v-model="linkType" placeholder="Select" style="width: 110px">
            <el-option
              v-for="(item, index) in linkTypes"
              :key="index"
              :label="item.label"
              :value="item.label" />
          </el-select>
          <el-input v-model="link" readonly>
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
    </div>
    <template #action>
      <el-button type="danger" @click="handleClose">删除</el-button>
      <el-button type="primary" @click="copyLink">复制</el-button>
      <el-button type="primary" @click="copyLink">设为头像</el-button>
      <el-button type="success" @click="openLink">打开链接</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { ImageInter } from '@/typings/interface';
import { computed, ref } from 'vue';
import { useCopyText, useCtxInstance, useFormatImageSize } from '@/hooks/global'
import { linkTypes } from '@/global.config';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: ImageInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as ImageInter)
})
const emit = defineEmits(['update:modelValue'])
const ctx = useCtxInstance()

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

const link = computed({
  get () {
    const item = linkTypes.value.find(item => item.label === linkType.value)
    const { img_preview_url: url = '', img_name: filename = '' } = props.detail
    const obj = { url, filename }
    const tmp = item.value.replace(/\$\{/g, '${obj.')
    return eval('`' + tmp + '`')
  },
  set (val) {

  }
})

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
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
    .el-select {
      .el-input__wrapper {
        border-radius: 4px 4px 0 0;
      }
    }
    .el-input-group--append {
      margin-top: -1px;
      .el-input__wrapper {
        border-radius: 0 0 0 4px;
      }
    }
  }
}
</style>