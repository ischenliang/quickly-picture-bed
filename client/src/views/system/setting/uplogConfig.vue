<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'更新日志'">
      <el-row>
        <el-col :xl="24" :lg="24" :md="24">
          <el-form-item prop="name" label="日志内容">
            <bytemd-editor v-model:value="myForm.uplog" style="height: 500px;"></bytemd-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>

    <c-card :title="'关于系统'">
      <el-row>
        <el-col :xl="24">
          <el-form-item prop="desc" label="关于系统内容">
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
  } as SettingInter)
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
</style>