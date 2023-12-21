<template>
  <div class="drag-box" @click.prevent.stop="">
    <div class="drag-box-line"></div>
    <div class="drag-box-line"></div>
    <div class="drag-box-line"></div>
  </div>
</template>
<script lang="ts" setup>
  
</script>
<style lang="scss">
.drag-box {
  width: 100%;
  height: 36px;
  background: #d7d7d7;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px 4px 0 0;
  cursor: move;
  &-line {
    width: 46px;
    height: 2px;
    background: #888;
    margin-bottom: 5px;
  }
}
</style>