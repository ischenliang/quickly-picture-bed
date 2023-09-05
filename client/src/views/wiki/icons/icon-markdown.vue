<template>
  <wiki-icon :size="size" :color="color">
    <svg t="1693879787380" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M128 128h768a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m170.666667 533.333333v-170.666666l85.333333 85.333333 85.333333-85.333333v170.666666h85.333334v-298.666666h-85.333334l-85.333333 85.333333-85.333333-85.333333H213.333333v298.666666h85.333334z m469.333333-128v-170.666666h-85.333333v170.666666h-85.333334l128 128 128-128h-85.333333z" p-id="4350"></path></svg>
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