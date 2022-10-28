<template>
  <div class="sidebar-container">
    <div class="logo-bannner">
      <img src="http://pic.xyaxw.cn/static/img/logo.cf036a4d.jpg" alt="">
    </div>
    <el-menu
      :default-active="activeMenu"
      text-color="#969696"
      active-text-color="#2d8cf0"
      style="border-right: none;"
      router>
      <el-menu-item index="/">
        <el-icon><UploadFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/gallery">
        <el-icon><PictureFilled /></el-icon>
        <span>图库</span>
      </el-menu-item>
      <el-menu-item index="/bucket">
        <el-icon><HelpFilled /></el-icon>
        <span>存储桶</span>
      </el-menu-item>
      <el-menu-item index="/log">
        <el-icon><ChatDotRound /></el-icon>
        <span>操作日志</span>
      </el-menu-item>
      <el-sub-menu index="/system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/system/analysis">
          <el-icon><Odometer /></el-icon>
          <span>概况</span>
        </el-menu-item>
        <el-menu-item index="/system/user">
          <el-icon><UserFilled /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/system/bucketSource">
          <el-icon><DeleteFilled /></el-icon>
          <span>存储桶配置</span>
        </el-menu-item>
        <el-menu-item index="/system/dict">
          <el-icon><Basketball /></el-icon>
          <span>字典管理</span>
        </el-menu-item>
        <el-menu-item index="/system/log">
          <el-icon><List /></el-icon>
          <span>日志管理</span>
        </el-menu-item>
        <el-menu-item index="/system/setting">
          <el-icon><Tools /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 实例
 */
const route = useRoute()

/**
 * 变量
 */
const activeMenu: any = ref('/')
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
  padding: 20px 10px;
  .logo-bannner {
    width: 100%;
    img {
      width: 100%;
    }
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