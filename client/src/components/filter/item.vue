<template>
  <div class="filter-item">
    <span class="filter-text">{{ text }}</span>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: '默认文本'
  }
})
</script>

<style lang="scss">
.filter-item {
  display: flex;
  align-items: center;
  margin: 0 20px 15px 0;
  .filter-text {
    margin-right: 10px;
    color: #666666;
  }
  .el-select, .el-input {
    width: 200px;
    margin-right: 10px;
  }
  &:not(:last-child) {
    margin-right: 20px;
  }
}
</style>