<template>
  <!-- 组件wrapper -->
  <div class="login_wrapper">
    <div class="login-section">
      <div class="login-header">
        <div><img src="https://preview.pro.ant.design/logo.svg" alt="">轻量图床管理系统</div>
        <p>一套轻量级图片资源管理系统、图床系统</p>
      </div>
      <el-tabs class="type-tabs" v-model="activeTab">
        <el-tab-pane label="账号密码登录" name="first">
          <!--  class="animate__animated animate__slideInRight" -->
          <login-password :key="'first-' + activeTab"></login-password>
        </el-tab-pane>
        <el-tab-pane label="验证码登录" name="second">
          <!--  class="animate__animated animate__pulse" -->
          <login-verifycode :key="'second-' + activeTab"></login-verifycode>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LoginPassword from './component/login-password.vue'
import LoginVerifycode from './component/login-verifycode.vue'
/**
 * 实例
 */

/**
 * 变量
 */
const activeTab = ref('first')


/**
 * 回调函数
 */
</script>

<style lang="scss">
.login_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('http://info.itchenliang.club/static/jpg/bg-a1fb1e03.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .login-section {
    // background-color: rgba(0,0,0,0.2);
    background-color: #FFFFFF;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 10px;
    width: 450px;
    min-height: 300px;
    padding: 0 50px 0px 50px;
    box-sizing: border-box;
    z-index: 1;
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
  }
  .type-tabs {
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
    .el-tab-pane {
      --animate-duration: 0.5s;
    }
  }
}
</style>