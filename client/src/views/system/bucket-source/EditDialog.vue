<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="detail && detail.id ? '编辑存储源' : '新建存储源'"
    :width="'700px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" :label-position="'left'" class="dict-form">
      <el-form-item label="存储源名称" prop="name">
        <el-input v-model="form.name" size="large" />
      </el-form-item>
      <el-form-item label="存储源类别" prop="code">
        <el-select v-model="form.type" size="large" style="width: 100%">
          <el-option
            v-for="(item, index) in bucketTypes"
            :key="'item-' + index"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="config_str" label="存储源配置" class="inline-item">
        <monaco-editor v-model="form.config_str"></monaco-editor>
      </el-form-item>
    </el-form>
    <template #action>
      <el-button size="large" @click="handleClose">取 消</el-button>
      <el-button size="large" type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { BucketSourceInter, DictInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import monacoEditor from '@/components/editor/index.vue'
import Dict from '@/types/Dict';
import { JsonResponse } from '@/typings/req-res';
import BucketSource from '@/types/BucketSource';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: BucketSourceInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({
    name :'',
    code: '',
    config: [],
    config_str: JSON.stringify([], null, '\t')
  } as BucketSourceInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const bucketSource = new BucketSource()


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
const form: BucketSourceInter = reactive({
  id: '',
  name: '',
  type: '',
  config: [],
  config_str: JSON.stringify([], null, '\t')
})
const rules = reactive({
  name: [
    { required: true, message: '请输入存储源名称', trigger: ['blur'] }
  ],
  type: [
    { required: true, message: '请选择存储源类型', trigger: ['blur', 'change'] }
  ],
  config_str: [
    { required: true, message: '请输入存储源配置', trigger: ['blur'] }
  ]
})
const formRef = ref(null)
// 存储源类别
const bucketTypes = ref([])


/**
 * 数据获取
 */
// 获取存储源类别列表
const getDict = () => {
  const dict = new Dict()
  dict.detailByPro('code', 'bucket_source').then((res: DictInter) => {
    if (res) {
      bucketTypes.value = res.values
    }
  })
}
getDict()


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
        type: form.type,
        config: JSON.parse(form.config_str)
      }
      if (form.id) {
        bucketSource.update({
          id: form.id,
          ...tmp
        }).then(res => {
          handleClose()
          emit('submit')
        })
      } else {
        bucketSource.create(tmp).then(res => {
          handleClose()
          emit('submit')
        })
      }
    }
  })
}

watch(() => form.config_str, (val) => {
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