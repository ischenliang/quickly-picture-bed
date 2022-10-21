<template>
  <div class="c-upload">
    <!-- 上传进度条 -->
    <div class="c-upload__progress" v-if="slots.progress">
      <slot name="progress"></slot>
    </div>
    <!-- 上传内容区 -->
    <div class="c-upload__content">
      <div :class="['c-upload-dragger', dragging ? 'is-dragover' : '']"
        @drop="handleDrop"
        @dragover="handleDragover"
        @dragleave="handleDragleave"
        @click="handleClick">
        <slot></slot>
      </div>
      <input
        type="file"
        name="file"
        multiple
        ref="file"
        :accept="accept_str"
        class="c-upload__input"
        @change="handleChange">
    </div>
    <!-- 上传提示 -->
    <!-- <div class="c-upload__tip"></div> -->
    <slot name="tip"></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, useSlots } from 'vue';

interface Props {
  accept?: string[]
  limit?: number // 一次最多勾选文件数量
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  accept: () => (['*']),
  limit: 3
})
const emit = defineEmits(['upload'])
const slots = useSlots()

/**
 * 变量
 */
// 根据传入的accept字段，拼接出我们想要的格式
const accept_str = computed(() => {
  return '.' + props.accept.join(',.')
})
// 是否在拖拽中
const dragging = ref(false)
// input[type="file"]元素
const file: Ref<HTMLInputElement | null> = ref()



/**
 * 事件监听
 */
// 点击trigger区域，手动去触发input[type="file"]的click事件
const handleClick = () => {
  file.value.click()
}
// input[type="file"]的change事件
const handleChange = (e) => {
  if (e.target.files.length <= props.limit) {
    emit('upload', { files: e.target.files })
  } else {
    emit('upload', { error: '选择文件长度超出数量限制' })
  }
  file.value.value = ''
}
// 拖拽后放：将文件拖拽进拖拽区域后放开鼠标时会触发
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragging.value = false
  const files = e.dataTransfer.files
  if (files.length <= props.limit) {
    emit('upload', { files: files })
  } else {
    emit('upload', { error: '选择文件长度超出数量限制' })
  }
}
// 拖来拖去：将文件拖拽移入拖拽区时会触发
const handleDragover = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragging.value = true
}
// 拖拽离开:拖拽进去后不放开，然后又将鼠标离开拖拽区时会触发
const handleDragleave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragging.value = false
}
// 拖进
const handleDragenter = (e: DragEvent) => {

}
</script>

<style lang="scss">
.c-upload {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .c-upload__content {
    position: relative;
    flex: 1;
    .c-upload-dragger {
      background-color: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      min-height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      // user-select: none;
      .el-icon--upload {
        font-size: 67px;
        color: #C0C4CC;
        margin-bottom: 16px;
        line-height: 50px;
      }
      .el-upload__text {
        color: #606266;
        font-size: 14px;
        text-align: center;
      }
      &.is-dragover {
        border: 2px dashed #0974f7;
        background: rgba(32, 159, 255, 0.06);
      }
    }
    .c-upload__input {
      // position: absolute;
      // bottom: 0;
      // right: 0;
      // opacity: 0;
      display: none;
    }
  }
  .c-upload__tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
    flex-shrink: 0;
  }
  .c-upload__progress {
    height: 20px;
  }
}
</style>