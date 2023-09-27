<template>
  <c-icon :size="size" :color="color">
    <svg t="1693879787380" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M243.2 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="5208"></path><path d="M512 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="5209"></path><path d="M780.8 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="5210"></path></svg>
  </c-icon>
</template>
<script lang="ts" setup>
import cIcon from './c-icon.vue'

interface Props {
  color?: string
  size?: string | number
}
const props = withDefaults(defineProps<Props>(), {
  color: '#606266',
  size: '16'
})
</script>
<style lang="scss" scoped>
</style>