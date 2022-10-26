<template>
  <com-dialog
    :visible.sync="dialogVisible"
    :title="'快捷键绑定'"
    :width="'550px'"
    :before-close="handleClose">
    <div style="margin-bottom: 20px;">
      <p style="text-align: center;">先选所需的组合键，再按 Enter 键</p>
      <div class="habits-key">
        <el-input v-model="key" size="large" readonly></el-input>
      </div>
    </div>
    <!-- <template #action>
      <el-button type="danger" @click="handleClose">取消</el-button>
      <el-button type="danger" @click="handleClose">确定</el-button>
    </template> -->
  </com-dialog>
</template>

<script lang="ts" setup>
import { ImageInter } from '@/typings/interface';
import { computed, ref } from 'vue';
import { useCtxInstance, useFormatImageSize } from '@/hooks/global'

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: ImageInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as ImageInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])
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
const key = ref('')

/**
 * 回调函数
 */
const handleClose = () => {
  dialogVisible.value = false
}

document.onkeydown = (e) => {
  e.preventDefault()
  if (e.key === 'Enter' || e.keyCode === 13) {
    emit('submit', {
      id: props.detail.id,
      value: key.value
    })
    handleClose()
  } else {
    if (key.value.indexOf(e.key) === -1) {
      key.value += key.value ? ' + ' + e.key : e.key
    }
  }
}
</script>

<style lang="scss">
.habits-key {
  margin-top: 15px;
  .el-input__inner {
    text-align: center;
  }
}
</style>