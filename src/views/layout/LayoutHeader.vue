<template>
  <div class="app-header">
    <div class="app-logo">
      <!-- http://pic.xyaxw.cn/static/img/logo.cf036a4d.jpg -->
      <img src="http://imgs.itchenliang.club/img/20221004104212.png" alt="">
    </div>
    <div class="app-rightmenu"></div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.app-header {
  @include flex-layout-align(row, space-between, center);
  overflow: hidden;
  .app-logo {
    flex-shrink: 0;
    height: 100%;
    padding: 0 20px;
    img {
      height: 100%;
    }
  }
}
</style>