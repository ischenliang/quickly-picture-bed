<template>
  <div class="app-header">
    <router-link :to="'/'" tag="div" class="app-logo">
      <img :src="website.logo_preview || '/logo.png'" alt="系统logo">
      <span class="app-name">{{ website.name || '默认系统名称' }}</span>
    </router-link>
    <div class="app-rightmenu">
      <div class="app-features">
        <div class="feature-item" v-for="(item, index) in features" :key="'feature-item-' + index" @click="handleClick(item)">
          {{ item.text }}
          <div class="feature-item-icon" :style="{ backgroundImage: `url('${item.bg}')` }"></div>
        </div>
      </div>
      <div class="app-links">
        <a
          v-for="(item, index) in links"
          :key="index"
          :href="item.link"
          class="link-item"
          :target="item.target">
          {{ item.label }}
        </a>
      </div>
      <user-dropdown :user-info="userInfo" :roles="roles"></user-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useConfigStore from '@/store/config';
import { computed, ref } from 'vue';
import UserDropdown from '@/components/web/user/dropdown.vue'
import useUserStore from '@/store/user';
import Dict from '@/types/Dict';
import { useRouter } from 'vue-router';

/**
 * 实例
 */
const configStore = useConfigStore()
const userStore = useUserStore()
const router = useRouter()


/**
 * 变量
 */
const website = computed(() => {
  return configStore.systemConfig.website
})
const userInfo = computed(() => {
  return userStore.userInfo
})
const roles = computed(() => {
  const tmp = configStore.dicts.find(el => el.code === 'user_role').values || []
  return tmp.reduce((total, current, curIndex, array) => {
    total[current.value as string] = current.label
    return total
  }, {})
})
// 功能区
const features = ref([
  { text: 'ChatGPT', path: '/chatgpt', bg: new URL('./images/jhot.svg', import.meta.url).href }
])
// 超链接
const links = computed(() => {
  return configStore.systemConfig.bucket_service
})


/**
 * 逻辑处理
 */
// 功能区跳转
function handleClick (item) {
  router.push({
    path: item.path
  })
}
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
    .app-features {
      display: flex;
      align-items: center;
      .feature-item {
        position: relative;
        cursor: pointer;
        margin-right: 10px;
        text-decoration: none;
        font-weight: 550;
        // color: #606266;
        // color: #e95d29;
        color: #ff4d4d;
        padding: 0 10px;
        .feature-item-icon {
          // background-image: url('http://img.itchenliang.club/img/202303261456294.svg');
          width: 40px;
          height: 30px;
          background-size: 100%;
          position: absolute;
          top: -26px;
          animation: updown 1s infinite;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}

@keyframes updown {
  0% {
    transform: translate(-50%, -3px);
  }
  100% {
    transform: translateY(-50%, 0px);
  }
}
</style>