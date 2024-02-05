<template>
  <el-form class="website-form" :model="myForm" ref="formRef" :rules="rules" label-position="top" label-width="97px">
    <c-card :title="'插件配置'">
      <el-row>
        <el-col :xl="24" :lg="24" :md="24">
          <el-form-item prop="name" label="插件格式定义">
            <!-- <bytemd-editor v-model:value="myForm.uplog" style="height: 500px;"></bytemd-editor> -->
            <monaco-editor
              language="javascript"
              v-model="myForm.plugin.default"
              style="height: 500px;"></monaco-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </c-card>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import monacoEditor from '@/components/editor/index.vue'
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
  get: () => {
    if (!props.data.plugin) {
      return {
        ...props.data,
        plugin: {
          default: ''
        }
      }
    }
    return props.data
  },
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
</script>

<style lang="scss" scoped>
</style>