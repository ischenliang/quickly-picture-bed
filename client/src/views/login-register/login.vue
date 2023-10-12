<template>
  <layout>
    <div class="login-header">
      <!-- <img src="https://preview.pro.ant.design/logo.svg" alt=""> -->
      <div>
        <img :src="logo" alt="" />
        轻快图片管理系统</div>
      <!-- <p>一套轻量级图片资源管理系统、图床系统</p> -->
      <p>图片上传+管理新体验的轻量级图片管理系统、图床系统</p>
    </div>
    <el-tabs class="type-tabs" v-model="activeTab">
      <el-tab-pane label="账号密码登录" name="first">
        <login-password v-if="activeTab === 'first'" :key="'first-' + activeTab"></login-password>
      </el-tab-pane>
      <el-tab-pane label="验证码登录" name="second">
        <login-verifycode v-if="activeTab === 'second'" :key="'second-' + activeTab"></login-verifycode>
      </el-tab-pane>
    </el-tabs>
  </layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Layout from './layout.vue'
import LoginPassword from './component/login-password.vue'
import LoginVerifycode from './component/login-verifycode.vue'
import useConfigStore from '@/store/config';

/**
 * 实例
 */
const sytemStore = useConfigStore()

/**
 * 变量
 */
const activeTab = ref('first')
const logo = computed(() => {
  const website: any = sytemStore.systemConfig.website
  if (website) {
    return website.logo
  } else {
    return new URL('../logo.png', import.meta.url).href
  }
})


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