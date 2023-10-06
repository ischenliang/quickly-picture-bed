<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'网站logo&打赏'" :header-padding="'18px 15px'">
      <el-row>
        <el-col :xl="12" :lg="12">
          <el-form-item prop="website.logo" label="网站logo">
            <el-input v-model="myForm.website.logo" placeholder="请输入网站lodo图片地址" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12">
          <el-form-item prop="website.ico" label="网站ico">
            <el-input v-model="myForm.website.ico" placeholder="请输入网站ico图片地址" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12">
          <el-form-item prop="website.reward_alipay" label="阿里支付">
            <el-input v-model="myForm.website.reward_alipay" placeholder="请输入阿里支付二维码图片地址" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="12" :lg="12">
          <el-form-item prop="website.reward_weixin" label="微信支付">
            <el-input v-model="myForm.website.reward_weixin" placeholder="请输入网站微信支付二维码图片地址" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
    
    <c-card :title="'网站信息'">
      <el-row>
        <el-col :xl="8" :lg="12" :md="12">
          <el-form-item prop="website.name" label="网站名称">
            <el-input v-model="myForm.website.name" placeholder="请输入网站名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="12" :md="12">
          <el-form-item prop="desc" label="网站作者">
            <el-input v-model="myForm.website.author" placeholder="请输入网站作者" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="12" :md="12">
          <el-form-item prop="version" label="版本号">
            <el-input v-model="myForm.website.version" placeholder="请输入版本号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="24">
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
        <el-col :xl="24">
          <el-form-item prop="desc" label="网站描述">
            <el-input v-model="myForm.website.desc" placeholder="请输入网站描述" size="large" type="textarea" :rows="7" />
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
    
    <c-card :title="'关注我们'">
      <el-row>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="name" label="Github">
            <el-input v-model="myForm.contact.github" placeholder="请输入作者Github" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="title" label="Gitee">
            <el-input v-model="myForm.contact.gitee" placeholder="请输入作者Gitee" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="contact.weixin" label="微信">
            <el-input v-model="myForm.contact.weixin" placeholder="请输入作者微信号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="contact.qq" label="QQ">
            <el-input v-model="myForm.contact.qq" placeholder="请输入作者QQ号" size="large" />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12">
          <el-form-item prop="contact.qq_group" label="QQ群">
            <el-input v-model="myForm.contact.qq_group" placeholder="请输入社区QQ交流区" size="large" />
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
  'website.logo': [
    { required: true, message: '请输入网站logo', trigger: ['blur'] }
  ],
  'website.name': [
    { required: true, message: '请输入网站名称', trigger: ['blur'] }
  ]
})
const myForm = computed({
  get: () => props.data,
  set: (val) => {
    emit('update:data', val)
  }
})

/**
 * 回调函数
 */
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