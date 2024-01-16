<template>
  <div class="layout-wrapper">
    <layout-header></layout-header>
    <div class="app-container">
      <layout-sidebar></layout-sidebar>
      <div class="content-container">
        <div class="page-container" :style="style">
          <router-view v-slot="{ Component }">
            <keep-alive v-if="keepAlive">
              <component :is="Component"></component>
            </keep-alive>
            <component v-else :is="Component"></component>
          </router-view>
        </div>
        <!-- <layout-footer></layout-footer> -->
      </div>
    </div>

    <!-- <div class="task-center-entry" @click="openTaskCenter">
      <span>任务中心</span>
      <div class="task-center-entry-badge">15</div>
    </div> -->
    
    <task-center
      v-model:visible="visible"></task-center>
  </div>
</template>

<script lang="ts" setup>
import LayoutHeader from './LayoutHeader.vue'
import LayoutFooter from './LayoutFooter.vue'
import LayoutSidebar from './LayoutSidebar.vue'
import TaskCenter from './task-center.vue'
import { ref, watch } from 'vue';
import { useCtxInstance } from '@/hooks/global';
import { useRoute } from 'vue-router';

/**
 * 实例
 */
const ctx = useCtxInstance()
const route = useRoute()

/**
 * 变量
 */
const visible = ref(false)
const style = ref({
  flex: '1',
  backgroundColor: 'transparent'
})
// 是否缓存
const keepAlive = ref(false)

/**
 * 逻辑处理
 */
// 打开任务中心
const openTaskCenter = () => {
  visible.value = true
}


watch(() => ctx.$route, (val, old) => {
  if (['SystemSetting'].includes(val.name)) {
    style.value.flex = '0 0 calc(100% - 50px)'
  } else {
    style.value.flex = '1'
  }

  if (['About', 'Uplog'].includes(val.name)) {
    style.value.backgroundColor = '#fff'
  } else {
    style.value.backgroundColor = 'transparent'
  }
}, {
  immediate: true
})


watch(() => route, (val) => {
  const { keepAlive: alive } = val.meta
  keepAlive.value = alive ? true : false
}, {
  immediate: true,
  deep: true
})
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
    background: var(--el-bg-color-white);
    border-bottom: 1px solid var(--el-border-color);
  }
  .app-container {
    flex: 1;
    @include flex-layout(row);
    overflow: hidden;
    .sidebar-container {
      flex-shrink: 0;
      width: 240px;
      height: 100%;
      background: var(--el-bg-color-white);
      border-right: 1px solid var(--el-border-color);
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
        padding: 15px;
        position: relative;
      }
      .footer-container {
        flex-shrink: 0;
        height: 30px;
      }
    }
  }
  .task-center-entry {
    position: absolute;
    right: 17px;
    bottom: 100px;
    padding: 15px 8px;
    font-size: 14px;
    border: 1px solid var(--el-color-primary);
    border-radius: 9px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: var(--el-box-shadow-lighter);
    font-weight: 600;
    color: var(--el-text-color-primary);
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
      background: var(--el-color-danger);
      color: var(--el-color-white);
      writing-mode: horizontal-tb;
      border-radius: 7px;
      font-size: 12px;
      white-space: nowrap;
    }
  }
}
</style>