<template>
  <!-- 组件wrapper -->
  <div class="login_wrapper">
    <div class="login-section">
      <div class="login-text">图床管理系统</div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" :prefix-icon="User" placeholder="账号" size="large"></el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-bottom: 10px;">
          <el-input v-model="form.password" :prefix-icon="Lock" show-password placeholder="密码" size="large"></el-input>
        </el-form-item>
        <el-form-item prop="remember" style="text-align: left;margin-bottom: 10px;">
          <el-checkbox v-model="form.remember">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item class="login_btn">
          <el-button :loading="loading" type="primary" size="large" @click.native="login">登录</el-button>
        </el-form-item>
        <el-form-item class="register-enter" style="text-align: right;">
          <span>
            没有帐号？
            <router-link :to="'/register'">点此注册</router-link>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Users from '@/types/User';
import { UserInter } from '@/typings/interface';
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import useUserStore from '@/store/user'
import { useRouter } from 'vue-router';
import { useCtxInstance } from '@/hooks/global';
/**
 * 实例
 */
const user = new Users()
const userStore = useUserStore()
const router = useRouter()
const ctx = useCtxInstance()

/**
 * 变量
 */
const loading = ref(false)
const form = reactive({
  username: localStorage.getItem('email') || '',
  password: localStorage.getItem('password') || '',
  remember: false
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur'] }
  ]
})


/**
 * 回调函数
 */
const login = () => {
  user.login({
    email: form.username,
    password: form.password
  }).then((res: any) => {
    localStorage.setItem('email', form.username)
    localStorage.setItem('password', form.password)
    localStorage.setItem('token', res.token)
    userStore.updateUserInfo(res)
    ctx.$message({
      message: '登录成功',
      type: 'success',
      duration: 1000
    })
    router.push({
      path: '/'
    })
  })
}
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
  text-align: center;
  .login-section {
    // background-color: rgba(0,0,0,0.2);
    background-color: #FFFFFF;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 10px;
    width: 400px;
    min-height: 300px;
    padding: 0 50px 0px 50px;
    box-sizing: border-box;
    z-index: 1;
    .login-text{
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2.2rem;
      // color: #f2f2f2;
      color: #1e4874;
      margin: 20px 0;
      letter-spacing: 2px;
      text-shadow: 3px 3px 3px #e7e0de,
                   -2px -2px 2px #a1d4e7;
    }
    .login_btn{
      margin-bottom: 0px;
      button{
        width: 100%;
      }
    }
    .register-enter {
      margin-bottom: 0px;
      margin-top: 5px;
      .el-form-item__content {
        justify-content: flex-end;
        color: #40485b;
        a {
          color: #005980;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
    .el-form{
      padding-bottom: 10px;
      .el-input__inner{
        background-color: rgba(255,255,255,0.8);
        // font-size: 17px !important;
      }
    }
  }
}
</style>