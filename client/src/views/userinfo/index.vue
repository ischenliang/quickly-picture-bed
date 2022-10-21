<template>
  <div class="profile-container">
    <el-tabs :tab-position="'left'" v-model="activeTab" class="profile-tabs" type="border-card">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :name="item.name"
        :label="item.label">
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { markRaw, ref } from 'vue'
import base from './base.vue'
import security from './security.vue'
import binding from './binding.vue'
import notification from './notification.vue'

const activeTab = ref('base')
const tabs = ref([
  { label: '基本设置', name: 'base', component: markRaw(base) },
  { label: '账号设置', name: 'security', component: markRaw(security) },
  // { label: '账号绑定', name: 'binding', component: markRaw(binding) },
  { label: '新消息通知', name: 'notification', component: markRaw(notification) }
])
</script>

<style lang="scss">
.profile-container {
  // height: 100%;
  padding: 16px 0;
  background: #fff;
  .profile-tabs {
    // height: 100%;
    border: none !important;
    .el-tabs__header {
      width: 200px;
      background: #fff;
      border-bottom: none;
      .el-tabs__item {
        text-align: left !important;
        border: none !important;
        margin: 0 !important;
        margin-bottom: 8px !important;
        &.is-active {
          border-right: 3px solid #1890ff !important;
          background: #e6f7ff;
          font-weight: 700;
          color: rgb(24, 144, 255);
        }
      }
      .el-tabs__nav-wrap {
        margin-right: 0px !important;
      }
    }
    .el-tabs__content {
      padding: 8px 40px;
    }
  }
}
</style>