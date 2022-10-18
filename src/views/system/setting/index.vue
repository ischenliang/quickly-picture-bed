<template>
  <div class="system-setting">
    <c-card :title="'系统设置'">
      <c-tabs v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabs"
          :key="index"
          :label="item.label"
          :name="item.name">
          <template v-if="activeName === item.name">
            <component :is="item.component" v-model:data="form"></component>
          </template>
        </el-tab-pane>
      </c-tabs>
    </c-card>
  </div>
  <div class="page-action">
    <el-button size="medium" type="default">取消</el-button>
    <el-button size="medium" type="primary">保存</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref, toRaw } from 'vue'
import WebsiteConfig from './websiteConfig.vue'
import AboutConfig from './aboutConfig.vue'
import SystemConfig from './systemConfig.vue'
import UplogConfig from './uplogConfig.vue'
import { SettingInter } from '@/typings/interface'
import config from './config'

const activeName = ref('website')

const tabs = ref([
  { label: '网站配置', name: 'website', component: toRaw(WebsiteConfig) },
  { label: '关于我们', name: 'about', component: toRaw(AboutConfig) },
  { label: '系统配置', name: 'system', component: toRaw(SystemConfig) },
  { label: '更新日志', name: 'uplog', component: toRaw(UplogConfig) }
])

const form: Ref<SettingInter> = ref({
  ...config
})
</script>

<style lang="scss">
.system-setting {
  width: 100%;
  .el-input-number {
    width: 100%;
  }
  .website-form {
    padding: 0 30px;
    .submit-form-item {
      .el-form-item__content {
        justify-content: center;
      }
    }
  }
  .el-row {
    margin-bottom: 20px;
    .el-col {
      padding: 0 30px;
      .el-select {
        width: 100%;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.page-action {
  width: calc(100% - 240px);
  height: 50px;
  position: fixed;
  padding: 0 24px;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 -6px 16px -8px rgb(0 0 0 / 8%), 0 -9px 28px 0 rgb(0 0 0 / 5%), 0 -12px 48px 16px rgb(0 0 0 / 3%);
}
</style>