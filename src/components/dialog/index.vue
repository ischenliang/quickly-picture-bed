<style lang="scss">
.com-dialog {
  &.el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    border-radius: 10px;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);

    .el-dialog__header {
      padding: 15px 20px !important;
      margin-right: 0px !important;
      border-bottom: 1px solid #e8eaec;
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
    v-if="visible"
    :title="title"
    :draggable="false"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    :center="isCenter"
    :show-close="isShowclose"
    :width="width"
    destroy-on-close
    :class="footerBorder ? 'com-dialog com-dialog-border': 'com-dialog'"
    append-to-body>
    <slot> </slot>
    <div slot="footer" class="dialog-footer" :style="footerStyle">
      <slot name="action" />
    </div>
  </el-dialog>
</template>
<script lang="ts">
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '50%'
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    isShowclose: {
      type: Boolean,
      default: true
    },
    footerStyle: {
      type: Object,
      default: () => ({
        'text-align': 'right'
      })
    },
    footerBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>