<template>
  <div class="layout-wrapper">
    <layout-header></layout-header>
    <div class="app-container">
      <layout-sidebar></layout-sidebar>
      <div class="content-container">
        <div class="page-container">
          <router-view></router-view>
        </div>
        <!-- <layout-footer></layout-footer> -->
      </div>
    </div>

    <div class="task-center-entry" @click="openTaskCenter">
      <span>任务中心</span>
      <div class="task-center-entry-badge">15</div>
    </div>
    
    <task-center
      v-model:visible="visible"></task-center>
  </div>
</template>

<script lang="ts" setup>
import LayoutHeader from './LayoutHeader.vue'
import LayoutFooter from './LayoutFooter.vue'
import LayoutSidebar from './LayoutSidebar.vue'
import TaskCenter from './task-center.vue'
import { ref } from 'vue';

/**
 * 变量
 */
const visible = ref(false)

/**
 * 逻辑处理
 */
// 打开任务中心
const openTaskCenter = () => {
  visible.value = true
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.layout-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
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
  .task-center-entry {
    position: absolute;
    right: 17px;
    bottom: 100px;
    padding: 15px 8px;
    font-size: 14px;
    border: 1px solid #00aae7;
    border-radius: 9px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
    font-weight: 600;
    color: #00aae7;
    cursor: pointer;
    > span {
      writing-mode: vertical-lr;
      letter-spacing: 3px;
    }
    .task-center-entry-badge {
      position: absolute;
      top: 0;
      right: 0;
      padding: 2px 6px;
      transform: translate(50%, -50%);
      background: #f56c6c;
      color: #fff;
      writing-mode: horizontal-tb;
      border-radius: 7px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
}
</style>