<template>
  <com-dialog
    v-model="dialogVisible"
    :title="detail && detail.id ? '编辑存储桶' : '新建存储桶'"
    :width="'600px'"
    :before-close="handleClose">
    <div class="bucket-warning">
      <p>请不要随意更改存储桶配置的必填属性(除存储桶名称外)，修改后会自动同步到所有关联的图片，进而可能会导致图片加载失败。</p>
      <div class="bucket-warning-tips">
        存储桶说明1<br/>
      </div>
    </div>
    <el-form ref="formRef" :model="form" label-width="130px" :label-position="'left'" class="dict-form">
      <el-form-item
        label="存储源"
        prop="type"
        :rules="[
          { required: true, message: '请选择存储源', trigger: ['blur', 'change'] }
        ]">
        <p class="bucket-tips" style="color: red;">* 添加成功后存储源不可修改</p>
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
       <el-input v-model="form.name" size="large" placeholder="请输入存储桶名称" />
      </el-form-item>
      <template v-for="(item, index) in bucketConfigs" :key="'form-item' + form.type + index">
        <el-form-item
          v-if="!item.hidden"
          :label="item.label"
          :prop="item.field"
          :rules="[generateRules(item)]">
          <el-select v-if="item.options" v-model="item.default" size="large" style="width: 100%" :placeholder="item.placeholder" :disabled="item.disabled">
            <el-option
              v-for="(option, index) in item.options"
              :key="'item-' + index"
              :label="option.label"
              :value="option.value"/>
          </el-select>
          <el-input v-else v-model="item.default" size="large" :placeholder="item.placeholder" :disabled="item.disabled" />
          <p class="bucket-tips" v-if="item.tips" v-html="item.tips"></p>
        </el-form-item>
      </template>
    </el-form>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { BucketInter, BucketSourceConfig, BucketSourceInter, DictInter, MyPlugin } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import Dict from '@/types/Dict';
import BucketSource from '@/types/BucketSource';
import { BasicResponse, PageResponse } from '@/typings/req-res';
import Bucket from '@/types/Bucket';
import { useCtxInstance} from '@/hooks/global';
import axios from 'axios'

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
const form: BucketInter = reactive({
  id: '',
  type: '',
  tag: '',
  name: '',
  config: '',
  visible: true,
  uid: '',
  plugin: ''
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
  bucketSource.find({
    status: true
  }).then((res: PageResponse<BucketSourceInter>) => {
    handleBucketData(res.items)
    if (form.type) {
      handleData(form.type)
    }
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
        obj[item.field] = item.default
      })
      const tmp = {
        name: form.name,
        type: form.type,
        tag: form.tag,
        config: JSON.stringify(obj),
        uid: form.uid,
        plugin: form.plugin
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
    ctx.$message({ message: '新建成功', duration: 1000, type: 'success' })
  })
}
// 更新
const itemUpdate = (data) => {
  bucket.update(data).then(res => {
    handleClose()
    emit('submit')
    ctx.$message({ message: '更新成功', duration: 1000, type: 'success' })
  })
}
// 处理数据
const handleData = (type: string) => {
  const { config: pluginConfig, name } = bucketSources.value.find(item => {
    return item.type === type
  })
  form.tag = name
  form.plugin = pluginConfig
  // 处理config，判断是否有默认值，有默认值则自动填充
  const plugin: MyPlugin = new Function('return ' + pluginConfig)()
  bucketConfigs.value = plugin.config.map(item => {
    if (form.config) {
      const config = JSON.parse(form.config)
      if (config[item.field] && !item.hidden) {
        item.default = config[item.field]
      }
    }
    return item
  })
}
// 处理存储桶配置数据
const handleBucketData = (data) => {
  bucketSources.value = data.map(item => {
    if (form.type === item.type) {
      const plugin: MyPlugin = new Function('return ' + item.config)()
      bucketConfigs.value = plugin.config.map(el => {
        // 解决新增属性出现undefined问题
        const config = JSON.parse(form.config)
        if (config[el.field] && !el.hidden) {
          el.default = config[el.field]
        }
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
    console.log(123)
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
  .bucket-tips {
    font-size: 12px;
    color: #898989;
    line-height: 18px;
  }
}
.bucket-warning {
  margin-bottom: 15px;
  font-size: 14px;
  p {
    line-height: 22px;
  }
  .bucket-warning-tips {
    // padding-left: 28px;
    // color: #898989;
    line-height: 20px;
  }
}
</style>