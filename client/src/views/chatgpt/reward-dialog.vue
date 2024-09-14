<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'请作者喝冰可乐~'"
    :width="'600px'"
    :before-close="handleClose">
    <div class="chatgpt-message-empty">
      <p>永久免费用于学习和测试，支持上下文。</p>
      <p>由于chatgpt限制，故本系统最大支持6条上下文记录。</p>
      <p>赶快在下面输入框中输入你的内容测试测试吧！！</p>
      <p>服务器昂贵，接口昂贵，但网站免费！！</p>
      <p style="font-weight: bold;">如果你觉得做的好，可以给我买一瓶冰阔落</p>
      <el-image :src="alipay"></el-image>
    </div>
  </com-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
/**
 * 实例
 */
 interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})
const emit = defineEmits(['update:modelValue'])

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
// alipay_url
const alipay = new URL('./alipay.jpg', import.meta.url).href


/**
 * 回调函数
 */
 const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style lang="scss">
.chatgpt-message-empty {
  flex: 1;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    line-height: 25px;
    color: rgb(51, 54, 57);
    flex-shrink: 0;
  }
  .el-image {
    width: 200px !important;
    flex-shrink: 0;
  }
}
</style>