<template>
  <div>
    <monaco-editor
      v-model="value"
      language="javascript"
      style="width: 100%;height: 600px;">
    </monaco-editor>
    <el-button type="primary" @click="handleClick">确定</el-button>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import MonacoEditor from '@/components/editor/index.vue'
import { ref } from 'vue';
// 注意：这里需要设计成立即执行函数，如果直接使用对象则是不支持的
const value = ref('(() => {})()')

const handleClick = () => {
  console.log(value.value)
  const plugin = new Function(`return ${value.value}`)()
  // plugin可能会是单纯的一个函数或者一个立即执行函数
  console.log(plugin())
}
</script>

<style lang="scss">

</style>