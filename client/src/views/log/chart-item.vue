<template>
  <div class="chart-item">
    <div class="chart-item__header">
      <span class="title">{{ title }}</span>
      <span class="unit" v-if="unit">({{ unit }})</span>
    </div>
    <div class="chart-item__content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  title: string
  unit?: string
}
defineProps<Props>()
</script>
<style lang="scss">
.chart-item {
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-white);
  height: 300px;
  &__header {
    padding: 0 15px;
    height: 46px;
    border-bottom: 1px solid var(--el-border-color-light);
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      color: var(--el-text-color-primary);
    }
    .unit {
      font-size: 14px;
      margin-left: 5px;
      vertical-align: baseline;
      color: var(--el-text-color-secondary);
      padding-top: 5px;
    }
  }
  &__content {
    flex: 1;
    overflow: hidden;
  }
}
</style>