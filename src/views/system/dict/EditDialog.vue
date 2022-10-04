<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="detail && detail.id ? '编辑字典' : '新建字典'"
    :width="'600px'">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :label-position="'left'">
      <el-form-item label="字典名称" prop="name">
       <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
       <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item prop="values_str" label="字典内容" class="inline-item">
        <monaco-editor v-model="form.values_str"></monaco-editor>
      </el-form-item>
    </el-form>
    <template #action>
      <el-button size="large" @click="handleClose">取 消</el-button>
      <el-button size="large" type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { DictInter } from '@/typings/interface';
import { computed, reactive, ref, watch } from 'vue';
import monacoEditor from '@/components/editor/index.vue'


interface Props {
  visible: boolean
  detail: DictInter
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  detail: () => ({
    name :'',
    code: ''
  } as DictInter)
})


/**
 * 变量
 */
const dialogVisible = computed(() => {
  return props.visible
})
const form: DictInter = reactive({
  id: '',
  name: '',
  code: '',
  values: [],
  values_str: ''
})
const rules = reactive({
  name: [
    { required: true, message: '请输入字典名称', trigger: ['blur'] }
  ],
  code: [
    { required: true, message: '请输入字典名称', trigger: ['blur'] }
  ],
  values: [
    { required: true, message: '请输入字典名称', trigger: ['blur'] }
  ]
})

/**
 * 回调函数
 */
const handleClose = () => {

}
const submit = () => {

}

watch(() => form.values_str, (val) => {
  console.log(JSON.parse(val) as Array<{ label: string, value: string }>)
  console.log(JSON.parse(val) instanceof Array<{ label: string, value: string }>)
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
</style>