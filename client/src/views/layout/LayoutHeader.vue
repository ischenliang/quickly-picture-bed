<template>
  <div class="app-header">
    <router-link :to="'/'" tag="div" class="app-logo">
      <img v-if="website.logo" :src="website.logo_preview || 'http://imgs.itchenliang.club/img/20221004104212.png'" alt="">
      <span class="app-name">{{ website.name || '默认名称' }}</span>
    </router-link>
    <!-- <div class="app-logo">
      http://pic.xyaxw.cn/static/img/logo.cf036a4d.jpg
      <img v-if="website.logo" :src="website.logo_preview || 'http://imgs.itchenliang.club/img/20221004104212.png'" alt="">
      <span class="app-name">{{ website.name || '默认名称' }}</span>
    </div> -->
    <div class="app-rightmenu">
      <div class="app-links">
        <!-- <div class="link-item">文档</div>
        <div class="link-item">Github</div> -->
        <a
          v-for="(item, index) in JSON.parse(configStore.systemConfig.bucket_service)"
          :key="index"
          :href="item.link"
          class="link-item"
          :target="item.target">{{ item.label }}</a>
      </div>
      <user-dropdown
        :user-info="userInfo"
        :roles="roles"></user-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useConfigStore from '@/store/config';
import { computed, ref } from 'vue';
import UserDropdown from '@/components/web/user/dropdown.vue'
import useUserStore from '@/store/user';
import Dict from '@/types/Dict';
import { DictInter } from '@/typings/interface';

/**
 * 实例
 */
const configStore = useConfigStore()
const userStore = useUserStore()
const dict = new Dict()

const website = computed(() => {
  return configStore.systemConfig.website
})
const userInfo = computed(() => {
  return userStore.userInfo
})
const roles = ref({})


const getRoles = () => {
  dict.detailByPro('code', 'user_role').then((res: DictInter) => {
    const tmp: any = {}
    res.values.forEach(el => {
      tmp[el.value as string] = el.label
    })
    roles.value = tmp
  })
}
getRoles()
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.app-header {
  @include flex-layout-align(row, space-between, center);
  overflow: hidden;
  width: 100%;
  .app-logo {
    flex-shrink: 0;
    height: 100%;
    padding: 5px 20px;
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
    &:link, &:visited {
      text-decoration: none;
    }
  }
  .app-rightmenu {
    height: 100%;
    padding: 0 20px;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .app-links {
      display: flex;
      align-items: center;
      .link-item {
        margin-right: 10px;
        font-size: 14px;
        padding: 0 10px;
        height: 40px;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        color: #606266;
        &:hover {
          color: #32cfaa;
        }
      }
    }
  }
}
</style>