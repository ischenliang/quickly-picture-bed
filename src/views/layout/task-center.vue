<template>
  <el-drawer
    v-model="myVisible"
    :size="600"
    custom-class="task-center"
    :close-on-press-escape="true"
    :show-close="true"
    :before-close="handleClose">
    <template #header>
      <h4>我的标题</h4>
    </template>
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  visible: boolean
}
/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const emit = defineEmits(['update:visible'])


/**
 * 变量
 */
const myVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})


/**
 * 逻辑处理
 */
// 关闭抽屉
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<style lang="scss">
.task-center {
  .el-drawer__header {
    align-items: center;
    display: flex;
    height: 55px;
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
    color: rgba(0,0,0,.85);
  }
}
</style>