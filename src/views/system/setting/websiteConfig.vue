<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'网站logo&打赏'" :header-padding="'18px 15px'">
      <el-row>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="logo" label="网站logo">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="ico" label="网站ico">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="ico" label="阿里支付">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="6">
          <el-form-item prop="ico" label="微信支付">
            <div style="width: 200px;height: 130px;border: 1px solid #ddd;"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
    
    <c-card :title="'网站信息'">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="website.name" label="网站名称">
            <el-input v-model="myForm.website.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="website.title" label="网站标题">
            <el-input v-model="myForm.website.title" placeholder="请输入网站标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="subtitle" label="网站副标题">
            <el-input v-model="myForm.website.subtitle" placeholder="请输入网站副标题" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="desc" label="网站作者">
            <el-input v-model="myForm.website.desc" placeholder="请输入网站作者" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="domain" label="网站域名">
            <el-input v-model="myForm.website.domain" placeholder="请输入网站域名" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="keys" label="网站关键字">
            <el-select
              v-model="myForm.website.keys"
              multiple
              filterable
              allow-create
              default-first-option
              size="large"
              :reserve-keyword="false"
              placeholder="网站关键字">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="12">
          <el-form-item prop="domain" label="版本号">
            <el-input v-model="myForm.website.domain" placeholder="请输入版本号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="24">
          <el-form-item prop="desc" label="网站描述">
            <el-input v-model="myForm.website.desc" placeholder="请输入网站描述" size="large" type="textarea" :rows="7" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
  </el-form>
</template>

<script lang="ts" setup>
import { SettingInter } from '@/typings/interface';
import { computed, reactive, ref } from 'vue';
import config from './config'
interface Props {
  data: SettingInter
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    ...config
  })
})
const emit = defineEmits(['update:data'])

/**
 * 变量
 */
const formRef = ref()
const options = []
const rules = reactive({
  logo: [
    { required: true, message: '请输入网站logo', trigger: ['blur'] }
  ],
  'website.name': [
    { required: true, message: '请输入网站名称', trigger: ['blur'] }
  ],
  'website.title': [
    { required: true, message: '请输入网站标题', trigger: ['blur'] }
  ]
})
const myForm = computed({
  get: () => props.data,
  set: (val) => {
    console.log(val)
    emit('update:data', val)
  }
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