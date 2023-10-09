<template>
  <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
    <el-form-item prop="username">
      <el-input v-model="form.username" :prefix-icon="'Cellphone'" placeholder="邮箱账号" size="large">
        <template #append>
          <el-select v-model="form.username_suffix" placeholder="请选择邮箱类型" style="width: 120px" size="large">
            <email-options></email-options>
          </el-select>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="verify-code" prop="verify_code">
      <el-input v-model="form.verify_code" placeholder="请输入图形验证码" size="large"></el-input>
      <img :src="imgCode.code" title="看不清，点击图片换一张" alt="" @click="getImgCode">
    </el-form-item>
    <el-form-item class="email-code" prop="sms_code">
      <el-input v-model="form.sms_code" placeholder="请输入邮箱验证码" size="large">
        <template #suffix>
          <el-button text type="primary" @click="getSmsCode" v-loading="sms_loading" :disabled="imgCode.counter !== 60">
            {{ imgCode.msg }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="remember" class="register-enter">
      <span></span>
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
import { computed, reactive, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie'
import { FormInstance } from 'element-plus';
import VerifyCode from '@/types/VerifyCode';
import { VerifyCodeInter } from '@/typings/interface';
import EmailOptions from './email-options.vue'

/**
 * 实例
 */
const user = new Users()
const router = useRouter()
const ctx = useCtxInstance()
const verifyCode = new VerifyCode()


/**
 * 变量
 */
const loading = ref(false)
const sms_loading = ref(false)
const co_email = Cookies.get('email')
const form = reactive({
  username: co_email || '',
  username_suffix: '@163.com',
  password: localStorage.getItem('password') || '',
  remember: false,
  verify_code: '',
  sms_code: '',
  verify_id: '',
})
if (co_email) {
  const lastIndex = co_email.lastIndexOf('@')
  form.username = co_email.slice(0, lastIndex)
  form.username_suffix = co_email.slice(lastIndex, co_email.length)
}
const rules = reactive({
  username: [
    { required: true, message: '请输入邮箱账号', trigger: ['blur'] }
  ],
  verify_code: [
    { required: true, message: '请输入图形验证码', trigger: ['blur'] }
  ],
  sms_code: [
    { required: true, message: '请输入邮箱验证码', trigger: ['blur'] }
  ]
})
const formRef: Ref<FormInstance | null> = ref()
// 图形验证码
const imgCode = reactive({
  id: '-',
  code: '',
  msg: '获取验证码',
  counter: 60
})
// 计算出实际邮箱地址
const email = computed(() => {
  return form.username + form.username_suffix
})


/**
 * 回调函数
 */
const login = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      user.login({
        email: email.value,
        sms_code: form.sms_code,
        type: 'verify_code'
      }).then((res: any) => {
        loading.value = false
        Cookies.set('email', email.value)
        localStorage.setItem('token', res.token)
        ctx.$message({ message: '登录成功', type: 'success', duration: 1000 })
        router.push({ path: '/' })
      }).catch((error) => {
        ctx.$message({ message: error.message, type: 'error', duration: 1000 })
        if (error.message !== '验证码不正确') {
          getImgCode()
        }
        loading.value = false
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
    imgCode.code = res.data
    form.verify_id = res.id
  })
}
getImgCode()
// 获取短信验证码
const getSmsCode = () => {
  formRef.value.validateField(['username', 'verify_code'], (valid) => {
    if (valid) {
      sms_loading.value = true
      verifyCode.smsSend({
        account: email.value,
        verify_id: form.verify_id,
        verify_code: form.verify_code,
        type: 'email'
      }).then(res => {
        ctx.$message({ message: '验证码发送成功', duration: 1000, type: 'success' })
        imgCode.msg = '验证码发送成功'
        sms_loading.value = false
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
      }).catch((error) => {
        ctx.$message({ message: error.message, type: 'error', duration: 1000 })
        sms_loading.value = false
      })
    }
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
  .el-select {
    .el-input--suffix {
      .el-input__wrapper {
        padding: 1px 8px !important;
      }
      .el-input__inner {
        background-color: transparent !important;
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