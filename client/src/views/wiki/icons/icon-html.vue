<template>
  <wiki-icon :size="size" :color="color">
    <svg t="1693879787380" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M128 0l888.832 0-72.704 843.776-376.832 115.712-358.4-115.712zM839.68 254.976l21.504-128-572.416-1.024 36.864 384 372.736 0 0 100.352-124.928 44.032-130.048-46.08-8.192-54.272-102.4 1.024 15.36 135.168 219.136 76.8 230.4-72.704 29.696-309.248-405.504 0-10.24-130.048 428.032 0z" p-id="4285"></path></svg>
  </wiki-icon>
</template>
<script lang="ts" setup>
import WikiIcon from './wiki-icon.vue'

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