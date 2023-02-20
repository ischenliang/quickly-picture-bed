<template>
  <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
    <el-form-item prop="username">
      <el-input v-model="form.username" :prefix-icon="'User'" placeholder="账号或邮箱" size="large"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" :prefix-icon="'Lock'" show-password placeholder="密码" size="large"></el-input>
    </el-form-item>
    <el-form-item class="verify-code" prop="verify_code" style="margin-bottom: 10px;">
      <el-input v-model="form.verify_code" placeholder="请输入验证码" size="large"></el-input>
      <img :src="imgCode.code" alt="" @click="getImgCode">
    </el-form-item>
    <el-form-item prop="remember" class="register-enter">
      <el-checkbox v-model="form.remember">记住密码</el-checkbox>
      <span>
        <router-link :to="'/register'">新注册账号</router-link>
        <router-link :to="'/forget'">找回密码</router-link>
      </span>
    </el-form-item>
    <el-form-item class="login_btn">
      <el-button :loading="loading" type="primary" size="large" @click.native="login">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import Users from '@/types/User';
import { VerifyCodeInter } from '@/typings/interface'
import VerifyCode from '@/types/VerifyCode';
import { onMounted, reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstance } from 'element-plus';
import Cookies from 'js-cookie'
import key from 'keymaster'

/**
 * 实例
 */
const user = new Users()
const verifyCode = new VerifyCode()
const router = useRouter()
const ctx = useCtxInstance()


/**
 * 变量
 */
const loading = ref(false)
const form = reactive({
  username: Cookies.get('email') || '',
  password: Cookies.get('password') || '',
  verify_code: '',
  verify_id: '',
  remember: JSON.parse(Cookies.get('remember') || 'true') // 记住密码
})
const formRef: Ref<FormInstance | null> = ref()
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur'] }
  ],
  verify_code: [
    { required: true, message: '请输入验证码', trigger: ['blur'] }
  ]
})
// 图形验证码
const imgCode = reactive({
  id: '-',
  code: ''
})


/**
 * 回调函数
 */
const login = () => {
  formRef.value.validate(valid => {
    if (valid) {
      user.login({
        email: form.username,
        password: form.password,
        verify_id: form.verify_id,
        verify_code: form.verify_code
      }).then((res: any) => {
        if (form.remember) {
          Cookies.set('email', form.username)
          Cookies.set('password', form.password)
        }
        localStorage.setItem('token', res.token)
        ctx.$message({ message: '登录成功', type: 'success', duration: 1000 })
        router.push({ path: '/' })
      }).catch(error => {
        ctx.$message({ message: error.message, type: 'error', duration: 1000 })
        getImgCode()
      })
    }
  })
}
// 获取图形验证码
const getImgCode = () => {
  verifyCode.create({
    last_id: imgCode.id ? imgCode.id : '-'
  }).then((res: VerifyCodeInter) => {
    imgCode.id = res.id
    imgCode.code = res.code
    form.verify_id = res.id
  })
}
getImgCode()

onMounted(() => {
  key('enter', () => {
    login()
    return false
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault()
      login()
    }
  })

})
</script>

<style lang="scss">
.el-form.login-form{
  padding: 10px 0 25px;
  .el-input__inner{
    background-color: rgba(255,255,255,0.8);
    // font-size: 17px !important;
  }
  .register-enter {
    margin: 10px 0;
    .el-form-item__content {
      justify-content: space-between;
      color: #40485b;
      a {
        color: #409eff;
        text-decoration: none;
        cursor: pointer;
      }
      span {
        a {
          + a {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .verify-code {
    .el-form-item__content {
      justify-content: space-between;
      flex-wrap: nowrap;
      img {
        height: 40px;
        margin-left: 10px;
        border-radius: 4px;
        flex-shrink: 0;
        cursor: pointer;
      }
    }
  }
}
</style>