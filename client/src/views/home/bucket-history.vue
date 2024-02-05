<template>
  <div class="bucket-title">上传记录<small>(今日)</small></div>
  <div class="history-list">
    <template v-if="logs.length">
      <log-item v-for="(item, index) in logs" :key="index" :log="item"></log-item>
    </template>
    <template v-else>
      <div class="empty">今日还未上传图片哦</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { LogInter } from '@/typings/interface';
import LogItem from '@/components/web/log/item.vue'

withDefaults(defineProps<{ logs: LogInter[] }>(), {
  logs: () => ([] as LogInter[])
})

/**
 * 变量
 */

// 日志列表
// const logs: Ref<LogInter[]> = ref([
//   {
//     id: 'asdas2d42asd',
//     type: 1,
//     operate_id: 'ID:2366',
//     operate_cont: '509036ffc9a69659.png',
//     content: '上传了图片',
//     createdAt: '2022-10-11 10:47:25'
//   },
//   {
//     id: 'asdas2d42asd',
//     type: 2,
//     operate_id: '四川省成都市',
//     operate_cont: '172.168.110.234',
//     content: '登录了系统',
//     createdAt: '2022-10-10 22:48:24'
//   },
//   {
//     id: 'asdas2d42asd',
//     type: 1,
//     operate_id: 'ID:2366',
//     operate_cont: '509036ffc9a69659.png',
//     content: '上传了图片',
//     createdAt: '2022-10-11 10:47:25'
//   }
// ])
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
.bucket-title {
  font-size: 18px;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.history-list {
  overflow: auto;
  flex: 1;
  max-height: 300px;
  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
  }
}
</style>