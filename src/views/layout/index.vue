<template>
  <div class="layout-wrapper">
    <layout-header></layout-header>
    <div class="app-container">
      <layout-sidebar></layout-sidebar>
      <div class="content-container">
        <div class="page-container">
          <router-view></router-view>
        </div>
        <layout-footer></layout-footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LayoutHeader from './LayoutHeader.vue'
import LayoutFooter from './LayoutFooter.vue'
import LayoutSidebar from './LayoutSidebar.vue'
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.layout-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include flex-layout(column);
  // padding: 10px;
  .app-header {
    flex-shrink: 0;
    width: 100%;
    height: 60px;
    background: #fff;
    // box-shadow: 0 0 17px 0 rgb(130 122 122 / 10%);
    border-bottom: 1px solid #dcdee2;
  }
  .app-container {
    flex: 1;
    @include flex-layout(row);
    overflow: hidden;
    .sidebar-container {
      flex-shrink: 0;
      width: 240px;
      height: 100%;
      background: #fff;
      // box-shadow: 0 0 17px 0 rgb(130 122 122 / 10%);
      border-right: 1px solid #dcdee2;
    }
    .content-container {
      flex: 1;
      height: 100%;
      overflow: hidden;
      @include flex-layout(column);
      .page-container {
        flex: 1;
        width: 100%;
        overflow: auto;
        padding: 20px;
      }
      .footer-container {
        flex-shrink: 0;
        height: 30px;
        // background: red;
      }
    }
  }
}
</style>