<template>
  <el-card class="table-card" shadow="never">
    <template #header>
      <div class="left">
        <slot name="tabs"></slot>
      </div>
      <div class="right">
        <slot name="action"></slot>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
.table-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .el-card__header {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    border-bottom: none;
    > .el-button {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
  .el-card__body {
    flex: 1 1 auto;
    padding: 0 15px 15px 15px;
    overflow: hidden;
  }
}
</style>