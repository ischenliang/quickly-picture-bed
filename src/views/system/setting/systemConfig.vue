<template>
  <el-form class="website-form" :model="form" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    
    <c-card :title="'用户配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="默认密码">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="默认头像">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="默认性别">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="默认角色">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="密码加密">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="默认自我简介">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'上传配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="新建本地桶">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="存储桶容量限制">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="存储桶限制">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'图标配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="图标url">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="图标前缀(FontClass)">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="Font Family">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'其他配置'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="默认界面语言">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="存储桶容量限制">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="存储桶限制">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="工具url(七牛云token、图形验证码后台地址)">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="开启新手引导">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="开启图片懒加载">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="水印url">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <el-form-item class="submit-form-item">
      <el-button size="large" type="default">取消</el-button>
      <el-button size="large" type="primary">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

/**
 * 变量
 */
const form = reactive({
  logo: '',
  name: '',
  title: '',
  subtitle: '',
  domain: '',
  desc: '',
  keys: [],
  label_position: 'top', // form表单的label位置
  copyright_company: '', // 版权归属公司名称
  copyright_time: '', // 网站运营时间
  copyright_miitbeian: '', // 工信部备案号
  copyright_miiturl: 'https://beian.miit.gov.cn/', // 工信部备案地址(即工信部官网地址)
})
const formRef = ref()
const options = []
const rules = reactive({
  logo: [
    { required: true, message: '请输入网站logo', trigger: ['blur'] }
  ],
  name: [
    { required: true, message: '请输入网站名称', trigger: ['blur'] }
  ],
  title: [
    { required: true, message: '请输入网站标题', trigger: ['blur'] }
  ]
})
</script>

<style lang="scss">
.website-form {
  padding: 0 30px;
  .el-form-item__label {
    font-weight: 700;
  }
  .submit-form-item {
    .el-form-item__content {
      justify-content: center;
    }
  }
}
.el-row {
  margin-bottom: 20px;
  .el-col {
    padding: 0 20px;
    .el-select {
      width: 100%;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>