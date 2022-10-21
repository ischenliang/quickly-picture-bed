<template>
  <div class="user-base">
    <div class="user-base-title">基本设置</div>
    <div class="user-base-view">
      <div class="base-view-left">
        <el-form :model="form" :rules="rules" :label-position="'top'">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="form.name" placeholder="请输入用户名" size="large" />
          </el-form-item>
          <el-form-item label="邮箱" prop="name">
            <el-input v-model="form.name" placeholder="请输入用户名" size="large" />
          </el-form-item>
          <el-form-item label="联系电话" prop="name">
            <el-input v-model="form.name" placeholder="请输入用户名" size="large" />
          </el-form-item>
          <el-form-item label="职业" prop="name">
            程序猿  设计师  开发者  学生  其他
          </el-form-item>
          <el-form-item label="性别" prop="name">
            男 女 保密
          </el-form-item>
          <el-form-item label="地址" prop="name">
            <el-input v-model="form.name" placeholder="请输入用户名" size="large" />
          </el-form-item>
          <el-form-item label="角色组">
            管理员 开发者 普通用户
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input v-model="form.name" type="textarea" :rows="4" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="name" style="margin-top: 30px;">
            <el-button type="primary" size="large">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="base-view-right">

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const form = reactive({
  name: ''
})
const rules = reactive({
  name: [
    { message: '请输入用户名', required: true, trigger: ['blur'] }
  ]
})
</script>

<style lang="scss">
.user-base-title {
  margin-bottom: 12px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.user-base-view {
  display: flex;
  flex-direction: row;
  padding-top: 20px;
  .base-view-left {
    // min-width: 224px;
    // max-width: 448px;
    width: 440px;
  }
  .base-view-right {
    flex: 1;
  }
}
</style>