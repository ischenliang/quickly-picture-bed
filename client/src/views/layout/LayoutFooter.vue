<template>
  <div class="footer-container">
    <span>Copyright ©2022</span>
    <span>深圳航天科技创新研究院-成都研创中心</span>
    <span>版权所有</span>
    <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备06040745号</a>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.footer-container {
  font-size: 12px;
  color: #999;
  @include flex-layout-align(row, center, center);
  span {
    margin-right: 8px;
  }
}
</style>