<template>
  <div class="system-setting">
    <c-card :title="'系统设置'">
      <c-tabs>
        <el-tab-pane label="网站配置">
          <website-config></website-config>
        </el-tab-pane>
        <el-tab-pane label="关于我们">
          <about-config></about-config>
        </el-tab-pane>
        <el-tab-pane label="系统配置">
          <system-config></system-config>
        </el-tab-pane>
        <el-tab-pane label="更新日志">
          <uplog-config></uplog-config>
        </el-tab-pane>
      </c-tabs>
    </c-card>
  </div>
</template>

<script lang="ts" setup>
import WebsiteConfig from './websiteConfig.vue'
import AboutConfig from './aboutConfig.vue'
import SystemConfig from './systemConfig.vue'
import UplogConfig from './uplogConfig.vue'
</script>

<style lang="scss">
.system-setting {
  width: 100%;
  // height: 100%;
}
</style>