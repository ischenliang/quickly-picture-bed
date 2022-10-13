<template>
  <div class="bucket-title">上传记录</div>
  <div class="history-list">
    <log-item v-for="(item, index) in logs" :key="index" :log="item"></log-item>
  </div>
</template>

<script lang="ts" setup>
import { LogInter } from '@/typings/interface';
import { ref, Ref } from 'vue';
import LogItem from '@/components/web/log/item.vue'

/**
 * 变量
 */

// 日志列表
const logs: Ref<LogInter[]> = ref([
  {
    id: 'asdas2d42asd',
    type: 1,
    operate_id: 'ID:2366',
    operate_cont: '509036ffc9a69659.png',
    content: '上传了图片',
    createdAt: '2022-10-11 10:47:25'
  },
  {
    id: 'asdas2d42asd',
    type: 2,
    operate_id: '四川省成都市',
    operate_cont: '172.168.110.234',
    content: '登录了系统',
    createdAt: '2022-10-10 22:48:24'
  },
  {
    id: 'asdas2d42asd',
    type: 1,
    operate_id: 'ID:2366',
    operate_cont: '509036ffc9a69659.png',
    content: '上传了图片',
    createdAt: '2022-10-11 10:47:25'
  }
])
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
.bucket-title {
  font-size: 18px;
  margin-bottom: 15px;
  flex-shrink: 0;
}
.history-list {
  overflow: auto;
  flex: 1;
}
</style>