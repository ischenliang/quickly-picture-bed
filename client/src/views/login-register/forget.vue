<template>
  <layout>
    <div class="login-header">
      <div>
        <img :src="configStore.systemConfig.website.logo" alt="系统logo" />
        {{ configStore.systemConfig.website.name || '轻快图片管理系统' }}
      </div>
      <p>{{ configStore.systemConfig.website.desc || '图片上传+管理新体验的轻量级图片管理系统、图床系统' }}</p>
    </div>
    <el-tabs class="type-tabs" v-model="activeTab">
      <el-tab-pane label="重置密码" name="first">
        <forget-password :key="'first-' + activeTab"></forget-password>
      </el-tab-pane>
    </el-tabs>
  </layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Layout from './layout.vue'
import ForgetPassword from './component/forget-password.vue'
import useConfigStore from '@/store/config';

/**
 * 实例
 */
const configStore = useConfigStore()

/**
 * 变量
 */
const activeTab = ref('first')


/**
 * 回调函数
 */
</script>

<style lang="scss">
.type-tabs {
  .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
  .el-tab-pane {
    --animate-duration: 0.5s;
  }
}
.login-header{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0 10px;
  div {
    letter-spacing: 2px;
    color: #303133;
    font-weight: 500;
    font-size: 30px;
    letter-spacing: 4px;
    color: rgba(0,0,0,.85);
    display: flex;
    align-items: center;
    img {
      width: 44px;
      height: 44px;
      margin-right: 15px;
    }
  }
  p {
    margin-top: 12px;
    color: rgba(0,0,0,.45);
  }
}
.login_btn{
  margin-bottom: 0px;
  button{
    width: 100%;
    font-size: 16px;
  }
}
</style>