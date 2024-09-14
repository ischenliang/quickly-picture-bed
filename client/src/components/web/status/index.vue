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
  background: #fff;
  border: 1px solid #dcdfe6;
}
.status-primary .status-dot {
  background: #409eff;
}
.status-success .status-dot {
  background: #67c23a;
}
.status-info .status-dot {
  background: #909399;
}
.status-warning .status-dot {
  background: #e6a23c;
}
.status-danger .status-dot {
  background: #f56c6c;
}
</style>