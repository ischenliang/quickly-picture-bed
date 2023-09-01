<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑知识库' : '新建知识库'"
    :width="'700px'"
    :before-close="handleClose">
    <div class="wiki-dialog-inline">
      
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" :label-position="'top'" class="wiki-form">
      <el-form-item label="知识库名称" prop="name">
        <el-input v-model="form.name" size="large"></el-input>
      </el-form-item>
      <el-form-item label="知识库介绍" prop="name">
        <el-input type="textarea" v-model="form.name" size="large"></el-input>
      </el-form-item>
    </el-form>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading.submit" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { PluginInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: PluginInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as PluginInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])

/**
 * 变量
 */
const dialogVisible = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})
const form: PluginInter = reactive({
  name: '',
  title: ''
})
const rules = reactive({
  name: [
    { required: true, message: '请输入插件名称', trigger: ['blur', 'change'] }
  ]
})
const formRef = ref(null)
const loading = reactive({
  submit: false
})
/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
function submit () {
  formRef.value.validate(valid => {
    if (valid) {
    }
  })
}

watch(() => props.detail, (val) => {
  if (val) {
    form.id = props.detail.id
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.plugin-form {
  overflow: hidden;
}
</style>