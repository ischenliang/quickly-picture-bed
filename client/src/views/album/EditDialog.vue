<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="detail && detail.id ? '编辑相册' : '新建相册'"
    :width="'600px'"
    :before-close="handleClose">
    <div class="album-dialog">hahhaha</div>
    <template #action>
      <el-button size="large" @click="handleClose">取 消</el-button>
      <el-button size="large" type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { AlbumInter, BucketInter } from '@/typings/interface';
import { computed, reactive, ref, watch } from 'vue';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: AlbumInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({
    id: ''
  } as BucketInter)
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
const form: AlbumInter = reactive({
  id: '',
  name: '',
  desc: '',
  cover: '',
  background: '',
  uid: '',
  count: 0
})
// 表单ref
const formRef = ref(null)

/**
 * 数据获取
 */



/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}
const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (form.id) {
        itemUpdate()
      } else {
        itemCreate()
      }
    }
  })
}
// 创建
const itemCreate = () => {
  
}
// 更新
const itemUpdate = () => {
  
}

/**
 * 监听器
 */
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
.album-dialog  {
  width: 100%;
}
</style>