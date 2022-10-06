<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="detail && detail.id ? '编辑字典' : '新建字典'"
    :width="'600px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="form" label-width="130px" :label-position="'left'" class="dict-form">
      <p style="font-size: 12px; color: red;line-height: 32px;margin-left: 130px;">* 添加成功后存储源不可修改</p>
      <el-form-item
        label="存储源"
        prop="type"
        :rules="[
          { required: true, message: '请选择存储源', trigger: ['blur', 'change'] }
        ]">
        <el-select v-model="form.type" style="width: 100%" filterable size="large" :disabled="form.id ? true : false">
          <el-option
            v-for="(item, index) in bucketSources"
            :key="index"
            :label="item.name"
            :value="item.type"
            />
        </el-select>
      </el-form-item>
      <el-form-item
        label="存储桶名称"
        prop="name"
        :rules="[
          { required: true, message: '请输入存储桶名称', trigger: ['blur', 'change'] }
        ]">
       <el-input v-model="form.name" size="large" />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in bucketConfigs"
        :key="'form-item' + form.type + index"
        :label="item.label"
        :prop="item.value"
        :rules="[generateRules(item)]">
        <el-select v-if="item.listOptions" v-model="item.default" size="large" style="width: 100%" :placeholder="item.placeholder">
          <el-option
            v-for="(option, index) in item.listOptions_arr"
            :key="'item-' + index"
            :label="option.label"
            :value="option.value"/>
        </el-select>
        <el-input v-else v-model="item.default" size="large" :placeholder="item.placeholder" />
      </el-form-item>
    </el-form>
    <template #action>
      <el-button size="large" @click="handleClose">取 消</el-button>
      <el-button size="large" type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { BucketInter, BucketSourceConfig, BucketSourceInter, DictInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import Dict from '@/types/Dict';
import BucketSource from '@/types/BucketSource';
import { BasicResponse } from '@/typings/req-res';
import Bucket from '@/types/Bucket';

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
    id: ''
  } as BucketInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
const dict = new Dict()
const bucketSource = new BucketSource()
const bucket = new Bucket()


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
const form: BucketInter = reactive({
  id: '',
  type: '',
  tag: '',
  name: '',
  config: '',
  visible: true,
  uid: ''
})
// 表单ref
const formRef = ref(null)
// 存储源
const bucketSources: Ref<BucketSourceInter[]> = ref([])
// 存储源配置
const bucketConfigs: Ref<BucketSourceConfig[]> = ref([])

/**
 * 数据获取
 */
const getBucketSource = () => {
  bucketSource.find({}).then((res: BasicResponse<BucketSourceInter>) => {
    handleBucketData(res.data)
    handleData(form.type)
  })
}
getBucketSource()


// 校验表单项
const validateForItem = (data, rule, value, callback) => {
  if (!data.default) {
   return callback(`请输入${data.value}`)
  }
  return callback()
}
// 生成校验规则
const generateRules = (item) => {
  if (item.required) {
    return {
      required: item.required,
      trigger: ['blur', 'change'],
      validator: (rule, value, callback) => {
        validateForItem(item, rule, value, callback)
      }
    }
  }
  return '' // 不能直接返回null，会导致该项无法渲染 
}


/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let obj = {}
      bucketConfigs.value.forEach(item => {
        obj[item.value] = item.default
      })
      const tmp = {
        name: form.name,
        type: form.type,
        tag: form.tag,
        config: JSON.stringify(obj),
        uid: form.uid
      }
      if (form.id) {
        itemUpdate({ id: form.id, ...tmp })
      } else {
        itemCreate(tmp)
      }
    }
  })
}
// 创建
const itemCreate = (data) => {
  bucket.create(data).then(res => {
    handleClose()
    emit('submit')
  })
}
// 更新
const itemUpdate = (data) => {
  bucket.update(data).then(res => {
    handleClose()
    emit('submit')
  })
}
// 处理数据
const handleData = (type: string) => {
  const { config, name } = bucketSources.value.find(item => {
    return item.type === type
  })
  form.tag = name
  let promise = config.map(async item => {
    if (item.listOptions) {
      const res: any = await dict.detailByPro('code', item.listOptions)
      item.listOptions_arr = res.data.values
      return item
    }
    return item
  })
  Promise.all(promise).then(res => {
    bucketConfigs.value = res
  })
}
// 处理存储桶配置数据
const handleBucketData = (data) => {
  bucketSources.value = data.map(item => {
    if (form.type === item.type) {
      bucketConfigs.value = item.config.map(el => {
        el.default = JSON.parse(form.config)[el.value]
        return el
      })
    }
    return item
  })
}

/**
 * 监听器
 */
watch(() => form.type, (val) => {
  if (bucketSources.value.length) {
    handleData(val)
  }
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