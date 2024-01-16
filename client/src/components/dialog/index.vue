<style lang="scss">
.com-dialog {
  &.el-dialog {
    display: flex;
    flex-direction: column;
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    border-radius: 10px;

    .el-dialog__header {
      padding: 15px 20px !important;
      margin-right: 0px !important;
      border-bottom: 1px solid var(--el-border-color);
      margin-bottom: 0px;
    }
  }

  &.com-dialog-border {
    .el-dialog__footer {
      border-top: 1px solid #F0F0F0;
      margin-top: -1px; // 解决父容器设置边框后导致内部元素的边框变粗
    }
  }

  &.el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
    padding: 16px 30px;
  }
}
</style>
<template>
  <el-dialog
    :title="title"
    :draggable="false"
    v-model="visible"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    :center="isCenter"
    :show-close="isShowclose"
    :width="width"
    destroy-on-close
    :class="footerBorder ? 'com-dialog com-dialog-border': 'com-dialog'"
    append-to-body>
    <slot></slot>
    <template #footer>
      <div slot="footer" class="dialog-footer" :style="footerStyle">
        <slot name="action" />
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { StyleValue, computed } from 'vue';

interface Props {
  modelValue: boolean
  title?: string
  width?: string | number
  isCenter?: boolean
  isShowclose?: boolean
  footerStyle?: StyleValue
  footerBorder: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '提示',
  width: '50%',
  isCenter: false,
  isShowclose: true,
  footerStyle: () => ({
    'text-align': 'right'
  }),
  footerBorder: false
})

const emit = defineEmits(['update:modelValue'])


const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  visible.value = false
}
</script>