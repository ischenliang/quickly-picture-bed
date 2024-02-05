<template>
  <div class="log-item">
    <div class="log-item-avatar" v-if="showAvatar">
      <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="">
    </div>
    <div class="log-item-meta">
      <!--  （{{ log.operate_id }}） -->
      <div class="log-item-title">{{ log.content }} - {{ log.operate_cont }} ({{ log.client_info ? (log.client_info.province + log.client_info.city) : '未知' }})</div>
      <div class="log-item-desc">{{ log.createdAt }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LogInter } from '@/typings/interface'
interface Props {
  log: LogInter,
  showAvatar: boolean
}
withDefaults(defineProps<Props>(), {
  log: () => ({
    id: 'asdas2d42asd',
    type: 1,
    operate_id: 'ID:2366',
    operate_cont: '509036ffc9a69659.png',
    content: '上传了图片',
    createdAt: '2022-10-11 10:47:25'
  } as LogInter),
  showAvatar: false
})
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
.log-item {
  height: 56px;
  padding: 10px 0;
  @include flex-layout-align(row, space-between, center);
  + .log-item {
    border-top: 1px solid #e8eaec;
  }
  .log-item-avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .log-item-meta {
    flex: 1;
    height: 100%;
    @include flex-layout-align(column, space-between);
    .log-item-title {
      font-weight: 500;
      margin-bottom: 4px;
      color: #515a6e;
      font-size: 14px;
    }
    .log-item-desc {
      color: rgba(0,0,0,.45);
      font-size: 14px;
    }
  }
}
</style>