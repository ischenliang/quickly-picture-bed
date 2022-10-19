<template>
  <div class="app-header">
    <div class="app-logo">
      <!-- http://pic.xyaxw.cn/static/img/logo.cf036a4d.jpg -->
      <img :src="website.logo_preview || 'http://imgs.itchenliang.club/img/20221004104212.png'" alt="">
      <span class="app-name">{{ website.name || '默认名称' }}</span>
    </div>
    <div class="app-rightmenu"></div>
  </div>
</template>

<script lang="ts" setup>
import useConfigStore from '@/store/config';
import { computed } from 'vue';

/**
 * 实例
 */
const configStore = useConfigStore()

const website = computed(() => {
  return configStore.systemConfig.website
})
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
    display: flex;
    align-items: center;
    img {
      height: 100%;
    }
    .app-name {
      font-size: 22px;
      // font-weight: 600;
      margin-left: 10px;
      word-break: keep-all;
      white-space: nowrap;
      color: #181818;
    }
  }
}
</style>