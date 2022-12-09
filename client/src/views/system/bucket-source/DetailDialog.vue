<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'存储源预览'"
    :width="'600px'"
    :before-close="handleClose">
    <el-form ref="formRef" :model="bucketConfigs" label-width="auto" :label-position="'left'" class="dict-form">
      <template v-for="(item, index) in bucketConfigs" :key="'form-item' + index">
        <el-form-item
          v-if="!item.hidden"
          :label="item.label"
          :prop="bucketConfigs[index].field"
          :rules="[generateRules(item)]">
          <el-select v-if="item.type === 'option'" v-model="item.default" size="large" style="width: 100%" :placeholder="item.placeholder" :disabled="item.disabled">
            <el-option
              v-for="(option, index) in item.options"
              :key="'item-' + index"
              :label="option.label"
              :value="option.value"/>
          </el-select>
          <el-input
            v-else-if="item.type === 'password'"
            v-model="item.default"
            size="large"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            show-password />
          <el-input v-else v-model="item.default" :disabled="item.disabled" size="large" :placeholder="item.placeholder" />
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
import Dict from '@/types/Dict';
import { BucketSourceConfig, BucketSourceInter, MyPlugin } from '@/typings/interface';
import { computed, Ref, ref, watch } from 'vue'
import { FormInstance } from 'element-plus';

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
    config: ''
  } as BucketSourceInter)
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
const formRef: Ref<FormInstance> = ref()
// 存储源配置
const bucketConfigs: Ref<BucketSourceConfig[]> = ref([])




/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log(123)
    }
  })
}
// 校验表单项
const validateForItem = (data, rule, value, callback) => {
  if (!data.default) {
   return callback(`请输入${data.field}`)
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
 * 监听器
 */
watch(() => props.detail, (val) => {
  const { config }: BucketSourceInter = JSON.parse(JSON.stringify(val))
  const dict = new Dict()
  // 方式一
  // let promise = config.map(item => {
  //   if (item.listOptions) {
  //     return usePromiseToOrder(dict.detailByPro('code', item.listOptions), item)
  //   }
  //   return item
  // })
  // Promise.all(promise).then(res => {
  //   console.log(res)
  // })

  const plugin: MyPlugin = new Function('return ' + config)()
  bucketConfigs.value = plugin.config.map(item => {
    return item
  })

  // 方式二
  // let promise = config.map(async item => {
  //   if (item.listOptions) {
  //     const res: any = await dict.detailByPro('code', item.listOptions)
  //     item.listOptions_arr = res.values
  //     return item
  //   }
  //   return item
  // })
  // Promise.all(promise).then(res => {
  //   form.value = res
  // })

  // config.forEach((item, index) => {
  //   item.sort = index
  //   if (item.listOptions) {
  //     (async (el) => {
  //       const res: any = await dict.detailByPro('code', el.listOptions)
  //       if (res && res.data) {
  //         el.listOptions_arr = res.data.values
  //       } else {
  //         el.listOptions_arr = []
  //       }
  //       tmp.push(el)
  //     })(item)
  //   } else {
  //     tmp.push(item)
  //   }
  // })
  // console.log(tmp)
  // form.value = [
  //   ...tmp.value.sort()
  // ]
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="scss">
</style>