<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑字典' : '新建字典'"
    :width="'700px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :label-position="'left'" class="dict-form">
      <el-form-item label="字典名称" prop="name">
       <el-input v-model="form.name" size="large" />
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
       <el-input v-model="form.code" size="large" />
      </el-form-item>
      <el-form-item prop="values_str" label="字典内容" class="inline-item">
        <monaco-editor v-model="form.values_str"></monaco-editor>
      </el-form-item>
    </el-form>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { DictInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import monacoEditor from '@/components/editor/index.vue'
import Dict from '@/types/Dict';
import { useCtxInstance } from '@/hooks/global';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: DictInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({
    name :'',
    code: '',
    values: [],
    values_str: JSON.stringify([], null, '\t')
  } as DictInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const dict = new Dict()
const ctx = useCtxInstance()


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
const form: DictInter = reactive({
  id: '',
  name: '',
  code: '',
  values: [],
  values_str: JSON.stringify([], null, '\t')
})
const rules = reactive({
  name: [
    { required: true, message: '请输入字典名称', trigger: ['blur'] }
  ],
  code: [
    { required: true, message: '请输入字典名称', trigger: ['blur'] }
  ],
  values_str: [
    { required: true, message: '请输入字典名称', trigger: ['blur'] }
  ]
})
const formRef = ref(null)

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const tmp = {
        name: form.name,
        code: form.code,
        values: JSON.parse(form.values_str)
      }
      if (form.id) {
        dict.update({
          id: form.id,
          ...tmp
        }).then(res => {
          handleClose()
          emit('submit')
          ctx.$message({ message: '更新成功', type: 'success', duration: 1000 })
        })
      } else {
        dict.create(tmp).then(res => {
          handleClose()
          emit('submit')
          ctx.$message({ message: '创建成功', type: 'success', duration: 1000 })
        })
      }
    }
  })
}

watch(() => form.values_str, (val) => {
  // TODO: 做校验
  // console.log(JSON.parse(val) as Array<{ label: string, value: string }>)
  // console.log(JSON.parse(val) instanceof Array<{ label: string, value: string }>)
})
watch(() => props.detail, (val) => {
  if (val) {
    form.id = props.detail.id
    for (let key in form) {
      form[key] = props.detail[key]
    }
  }
}, {
  immediate: true
})
</script>

<style lang="scss">
.inline-item {
  flex-direction: column;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.dict-form {
  overflow: hidden;
}
</style>