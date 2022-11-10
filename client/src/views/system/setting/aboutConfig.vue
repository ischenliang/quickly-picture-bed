<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'关注我们'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="name" label="Github">
            <el-input v-model="myForm.contact.github" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="title" label="Gitee">
            <el-input v-model="myForm.contact.gitee" placeholder="请输入网站标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="subtitle" label="微信">
            <el-input v-model="myForm.contact.weixin" placeholder="请输入网站副标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="desc" label="QQ">
            <el-input v-model="myForm.contact.qq" placeholder="请输入网站作者" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="domain" label="QQ群">
            <el-input v-model="myForm.contact.qq_group" placeholder="请输入网站域名" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'关于系统'">
      <el-row>
        <el-col :xl="24">
          <el-form-item prop="desc" label="关于系统内容">
            <!-- <bytemd-editor v-model:value="value" style="height: 500px;"></bytemd-editor> -->
            <bytemd-editor
              :value="myForm.contact.about"
              :mode="'split'"
              style="height: 500px;"
              @change="handleChange"></bytemd-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import BytemdEditor from '@/components/editor/bytemd.vue'
import { SettingInter } from '@/typings/interface';
import config from './config'

/**
 * 实例
 */
const props = withDefaults(defineProps<{
  data: SettingInter
}>(), {
  data: () => ({
    ...config
  })
})
const emit = defineEmits(['update:data'])

/**
 * 变量
 */
const myForm = computed({
  get: () => props.data,
  set: (val) => {
    emit('update:data', val)
  }
})
const formRef = ref()
const rules = reactive({
  logo: [
    { required: true, message: '请输入网站logo', trigger: ['blur'] }
  ]
})

const handleChange = (v) => {
  myForm.value.contact.about = v
}
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