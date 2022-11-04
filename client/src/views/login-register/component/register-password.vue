<template>
  <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
    <el-form-item prop="email">
      <el-input v-model="form.email" :prefix-icon="'User'" placeholder="请输入邮箱地址" size="large"></el-input>
    </el-form-item>
    <el-form-item class="verify-code" prop="verify_code">
      <el-input v-model="form.verify_code" placeholder="请输入图形验证码" size="large"></el-input>
      <img :src="imgCode.code" title="看不清，点击图片换一张" alt="" @click="getImgCode">
    </el-form-item>
    <el-form-item class="email-code" prop="sms_code">
      <el-input v-model="form.sms_code" placeholder="请输入邮箱验证码" size="large">
        <template #suffix>
          <el-button text type="primary" @click="getSmsCode" :disabled="imgCode.counter !== 60">
            {{ imgCode.msg }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" :prefix-icon="'Lock'" show-password placeholder="设置密码(8-20位字母、数字或字符，至少包含两种)" size="large"></el-input>
    </el-form-item>
    <el-form-item prop="rpassword" style="margin-bottom: 10px;">
      <el-input v-model="form.rpassword" :prefix-icon="'Lock'" show-password placeholder="确认密码" size="large"></el-input>
    </el-form-item>
    <el-form-item prop="remember" class="register-enter">
      <span>
        <el-checkbox v-model="form.remember" /> 我同意
        <router-link :to="'/login'">《用户协议》</router-link><router-link :to="'/login'">《隐私协议》</router-link>
      </span>
      <span>已有账号，去 <router-link :to="'/login'">登录</router-link></span>
    </el-form-item>
    <el-form-item class="login_btn">
      <el-button :loading="loading" type="primary" size="large" @click.native="register">提交注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import Users from '@/types/User';
import { VerifyCodeInter } from '@/typings/interface'
import VerifyCode from '@/types/VerifyCode';
import { reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstance } from 'element-plus';

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
  email: '',
  password: '',
  rpassword: '',
  verify_code: '',
  sms_code: '',
  verify_id: '',
  remember: false // 统一协议
})
const formRef: Ref<FormInstance | null> = ref()
const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: ['blur'] },
    {
      validator: (rule, value, callback) => {
        if (!/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(value)) {
          return callback('邮箱格式不正确')
        }
        callback()
      }
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur'] },
    {
      trigger: ['blur', 'change'],
      validator: (rule, value, callback) => {
        if (!/^(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/.test(value)) {
          callback(new Error('8~20位字母、数字或字符，至少包含两种'))
        } else {
          callback()
        }
      }
    }
  ],
  rpassword: [
    { required: true, message: '请确认密码', trigger: ['blur'] },
    {
      trigger: ['blur', 'change'],
      validator: (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback()
        }
      }
    }
  ],
  verify_code: [
    { required: true, message: '请输入图形验证码', trigger: ['blur'] }
  ],
  sms_code: [
    { required: true, message: '请输入邮箱验证码', trigger: ['blur'] }
  ]
})
// 图形验证码
const imgCode = reactive({
  id: '-',
  code: '',
  msg: '获取验证码',
  counter: 60
})


/**
 * 回调函数
 */
const register = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (!form.remember) {
        return ctx.$message({ message: '请同意协议', type: 'warning', duration: 1000 })
      }
      user.register({
        account: form.email,
        password: form.password,
        sms_code: form.sms_code
      }).then((res: any) => {
        ctx.$message({ message: '注册成功，去登录吧', type: 'success', duration: 1000 })
        router.push({ path: '/login' })
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
// 获取短信验证码
const getSmsCode = () => {
  formRef.value.validateField(['email', 'verify_code'], (valid) => {
    if (valid) {
      verifyCode.smsSend({
        account: form.email,
        verify_id: form.verify_id,
        verify_code: form.verify_code,
        type: 'email'
      }).then(res => {
        ctx.$message({ message: '验证码发送成功', duration: 100, type: 'success' })
        imgCode.msg = '验证码发送成功'
        let timer = setInterval(() => {
          if (imgCode.counter <= 0) {
            clearInterval(timer)
            imgCode.msg = '重新获取验证码'
            imgCode.counter = 60
          } else {
            imgCode.counter--
            imgCode.msg = `${imgCode.counter}秒后可重发`
          }
        }, 1000)
      })
    }
  })
}
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
  .email-code {
    .el-input__wrapper {
      padding-right: 4px !important;
    }
    .el-button {
      padding: 8px 13px;
    }
  }
}
</style>