<template>
  <el-option
    v-for="(item, index) in options"
    :key="index"
    :label="item"
    :value="item" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const options = ref([
  '@qq.com',
  '@163.com',
  '@139.com',
  '@sohu.com',
  '@aliyun.com',
  '@189.com',
  '@hotmail.com',
  '@gmail.com',
  '@sina.com',
  '@yahoo.com'
])
</script>

<style lang="scss">

</style>