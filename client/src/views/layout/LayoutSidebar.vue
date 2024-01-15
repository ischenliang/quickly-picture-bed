<template>
  <div class="sidebar-container v-scrollbar">
    <div class="logo-bannner">
      <!-- <img src="./images/banner.png" alt=""> -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
        <image xlink:href="./images/banner2.webp" x="30" y="0" height="380" width="380" />
        <text x="410" y="130" class="text-title-en" font-family="Helvetica">LightFastPicture</text>
        <text x="410" y="245" class="text-title-cn" font-family="Helvetica">轻快图片管理系统</text>
        <text x="410" y="340" class="text-desc" font-family="Helvetica">轻量级快捷图片图床管理系统</text>
      </svg>
    </div>
    <el-menu
      :default-active="activeMenu"
      text-color="#969696"
      active-text-color="#2d8cf0"
      style="border-right: none;"
      router>
      <template v-for="(item, index) in menus[0].children" :key="index">
        <el-sub-menu v-if="item.children" :index="item.path">
          <template #title>
            <el-icon><component :is="item.meta.icon"></component></el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
          <template v-for="(subItem, subIndex) in item.children" :key="subIndex">
            <el-menu-item
              v-if="!subItem.meta.hidden"
              :index="subItem.path">
              <el-icon><component :is="subItem.meta.icon"></component></el-icon>
              <span>{{ subItem.meta.title }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
        <el-menu-item v-else-if="!item.meta.hidden" :index="item.path">
          <el-icon><component :is="item.meta.icon"></component></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/user';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 实例
 */
const route = useRoute()
const userStore = useUserStore()

/**
 * 变量
 */
const activeMenu: any = ref('/')
const menus = computed(() => {
  return userStore.user_menus
})

/**
 * 监听器
 */
watch(() => route, (val) => {
  const { meta, path, name } = val
  if (meta && meta.active) {
    activeMenu.value = meta.active
  } else {
    activeMenu.value = path
  }
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="scss">
.sidebar-container {
  .logo-bannner {
    width: 100%;
    svg {
      width: 100%;
      background: var(--bg-color);
      border-bottom: 1px solid #dcdee2;
      text {
        &.text-title-en {
          fill: #409eff;
          font-size: 90px;
          font-weight: bold;
        }
        &.text-title-cn {
          fill: #0db3a6;
          font-size: 80px;
        }
        &.text-desc {
          fill: #969696;
          font-size: 54px;
        }
      }
    }
  }
  .el-menu {
    padding: 10px 20px;
  }
  .el-menu-item, .el-sub-menu__title {
    // height: 45px;
    // line-height: 45px;
    // margin: 5px 0;
    &.is-active {
      background: #f0faff;
      border-radius: 4px;
    }
    &:not(.is-active):hover {
      background: none;
    }
  }
}
</style>