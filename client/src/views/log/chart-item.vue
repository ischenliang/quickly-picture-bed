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
  background: #fff;
  height: 300px;
  &__header {
    padding: 0 15px;
    height: 46px;
    border-bottom: 1px solid #f5f7f9;
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      color: #000;
    }
    .unit {
      font-size: 14px;
      margin-left: 5px;
      vertical-align: baseline;
      color: #777;
      padding-top: 5px;
    }
  }
  &__content {
    flex: 1;
    // padding: 15px;
    overflow: hidden;
  }
}
</style>