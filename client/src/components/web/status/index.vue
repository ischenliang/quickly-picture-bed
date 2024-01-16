<template>
  <div :class="'status-container status-' + type">
    <span class="status-dot"></span>
    <span class="status-text">{{ text }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  text?: string
  size?: string | number
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  text: '文本',
  size: 8
})
const width = computed(() => {
  return props.size + 'px'
})
</script>

<style lang="scss" scoped>
.status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  .status-dot {
    border-radius: 50%;
    margin-right: 5px;
    flex-shrink: 0;
    width: v-bind(width);
    height: v-bind(width);
  }
}
.status-default .status-dot {
  background: var(--el-bg-color-white);
  border: 1px solid #dcdfe6;
}
.status-primary .status-dot {
  background: var(--el-color-primary);
}
.status-success .status-dot {
  background: var(--el-color-success);
}
.status-info .status-dot {
  background: var(--el-color-info);
}
.status-warning .status-dot {
  background: var(--el-color-warning);
}
.status-danger .status-dot {
  background: var(--el-color-danger);
}
</style>