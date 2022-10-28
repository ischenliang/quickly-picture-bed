<template>
  <div>用户的操作日志</div>
</template>

<script lang="ts" setup>
import Log from '@/types/Log';



/**
 * 实例
 */
const log = new Log()

/**
 * 数据获取
 */
const listGet = () => {
  log.find({}).then(res => {
    console.log(res)
  })
}
listGet()
</script>

<style lang="scss">

</style>