<template>
  <el-form class="website-form" :model="form" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'关注我们'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="Github">
            <el-input v-model="form.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="title" label="Gitee">
            <el-input v-model="form.title" placeholder="请输入网站标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="subtitle" label="微信">
            <el-input v-model="form.subtitle" placeholder="请输入网站副标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="desc" label="QQ">
            <el-input v-model="form.desc" placeholder="请输入网站作者" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="domain" label="QQ群">
            <el-input v-model="form.domain" placeholder="请输入网站域名" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'关于系统'">
      <el-row>
        <el-col :xl="24">
          <el-form-item prop="desc" label="关于系统内容">
            <!-- <el-input v-model="form.desc" placeholder="请输入网站描述" size="large" type="textarea" :rows="7" /> -->
            <bytemd-editor v-model:value="form.desc" style="height: 500px;"></bytemd-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <!-- <el-form-item class="submit-form-item">
      <el-button size="large" type="default">取消</el-button>
      <el-button size="large" type="primary">提交</el-button>
    </el-form-item> -->
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import BytemdEditor from '@/components/editor/bytemd.vue'

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

<style lang="scss" scoped>
.website-form {
  padding: 0 30px;
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