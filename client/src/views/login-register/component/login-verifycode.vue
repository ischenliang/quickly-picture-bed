<template>
  <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
    <el-form-item prop="username">
      <el-input
        v-model="form.username"
        :prefix-icon="'Cellphone'"
        placeholder="请输入邮箱"
        size="large" />
    </el-form-item>
    <el-form-item class="verify-code">
      <el-input placeholder="请输入验证码" size="large"></el-input>
      <div class="verify-code-img">获取验证码</div>
    </el-form-item>
    <el-form-item class="login_btn">
      <el-button :loading="loading" type="primary" size="large" @click.native="login">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import Users from '@/types/User';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

/**
 * 实例
 */
const user = new Users()
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
    ctx.$message({ message: '登录成功', type: 'success', duration: 1000 })
    router.push({ path: '/' })
  })
}
</script>

<style lang="scss">
.el-form.login-form{
  padding-bottom: 25px;
  .el-input__inner{
    background-color: rgba(255,255,255,0.8);
    // font-size: 17px !important;
  }
  .verify-code {
    .el-form-item__content {
      justify-content: space-between;
      flex-wrap: nowrap;
      .verify-code-img {
        width: 100px;
        height: 40px;
        flex-shrink: 0;
        margin-left: 10px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>