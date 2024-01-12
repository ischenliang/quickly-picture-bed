<template>
  <div>
    hello {{ title }}
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>
<style lang="scss">
div {
  color: red;
}
</style>