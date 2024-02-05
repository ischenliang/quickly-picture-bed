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
import { markRaw, ref, watch } from 'vue'
import base from './base.vue'
import security from './security.vue'
import binding from './binding.vue'
import notification from './notification.vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useCtxInstance } from '@/hooks/global'

const activeTab = ref('base')
const tabs = ref([
  { label: '基本设置', name: 'base', component: markRaw(base) },
  { label: '账号设置', name: 'security', component: markRaw(security) },
  // { label: '账号绑定', name: 'binding', component: markRaw(binding) },
  { label: '新消息通知', name: 'notification', component: markRaw(notification) }
])
const ctx = useCtxInstance()

const route = useRoute()
const router = useRouter()


// 方式一：参考https://blog.csdn.net/hfhwfw161226/article/details/125770613
watch(() => route, (val: any) => {
  activeTab.value = val.query.type as string
}, {
  deep: true,
  immediate: true
})


// 方式二
// watch(() => router.currentRoute.value.query, (val: any) => {
//   // activeTab.value = val.query.type as string
//   console.log(val)
// }, {
//   deep: true,
//   immediate: true
// })



// 方式三
// onBeforeRouteUpdate((to) => {
//   activeTab.value = to.query.type as string
// })


// 方式四
// watch(() => ctx.$route, (val: any) => {
//   // activeTab.value = val.query.type as string
//   console.log(val)
// }, {
//   deep: true,
//   immediate: true
// })
</script>

<style lang="scss">
.profile-container {
  height: 100%;
  padding: 16px 0;
  background: #fff;
  .profile-tabs {
    height: 100%;
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
        .el-tabs__nav {
          width: 100%;
          .el-tabs__item {
            justify-content: flex-start;
          }
        }
      }
    }
    .el-tabs__content {
      padding: 8px 40px;
    }
  }
}
</style>