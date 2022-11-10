<template>
  <div class="filter">
    <div class="filter-content">
      <slot name="content" />
      <div style="margin: 0 20px 15px 0;">
        <el-button type="default" @click="$emit('reset')">重置</el-button>
        <el-button type="primary" @click="$emit('filter')">查询</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.filter {
  background: white;
  padding: 15px 20px 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;

  .filter-content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }

  .filter-btn {
    display: flex;
    align-self: flex-end;
    padding-bottom: 15px;

    .el-button+.el-button {
      margin-left: 20px;
    }
  }
}
</style>
  