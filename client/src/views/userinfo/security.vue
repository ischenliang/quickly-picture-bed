<template>
  <div class="user-security">
    <div class="user-security-title">账号设置</div>
    <el-form :model="form" :rules="rules" :label-position="'right'" ref="formRef" :label-width="100">
      <el-form-item label="原始密码" prop="old_password">
        <el-input v-model="form.old_password" show-password placeholder="请输入原始密码" size="large" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入新密码" size="large" />
      </el-form-item>
      <el-form-item label="确认密码" prop="rpassword">
        <el-input v-model="form.rpassword" show-password placeholder="请再次输入新密码" size="large" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="submit">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useCtxInstance, useMd5 } from '@/hooks/global';
import useUserStore from '@/store/user';
import Users from '@/types/User';
import { FormInstance } from 'element-plus';
import { reactive, Ref, ref } from 'vue';

/**
 * 实例
 */
const user = new Users()
const ctx = useCtxInstance()
const userStore = useUserStore()

/**
 * 变量
 */
const form = reactive({
  old_password: '',
  password: '',
  rpassword: ''
})
const formRef: Ref<FormInstance | null> = ref()
const rules: any = reactive({
  old_password: [
    { required: true, message: '请输入原始密码', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      trigger: ['blur', 'change'],
      validator: (rule, value, callback) => {
        // if (!/^(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/.test(value)) {
        //   callback(new Error('8~20位字母、数字或字符，至少包含两种'))
        // } else {
        //   callback()
        // }
        if (value && value.trim().length < 5) {
          callback(new Error('密码长度不能少于5位'))
        } else {
          callback()
        }
      }
    }
  ],
  rpassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      trigger: ['blur', 'change'],
      validator: (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  ]
})

/**
 * 逻辑处理
 */
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (userStore.userInfo.email.toLocaleLowerCase() === 'guest@163.com') {
        return ctx.$message({
          message: '演示账号，为了确保其他人能正常访问，禁止修改密码',
          duration: 1000,
          type: 'warning'
        })
      }
      user.changePwd({
        password: form.password,
        old_password: form.old_password
      }).then(res => {
        ctx.$message({
          message: '密码修改成功',
          duration: 1000,
          type: 'success'
        })
      })
    }
  })
}
</script>

<style lang="scss">
.user-security-title {
  margin-bottom: 30px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
</style>