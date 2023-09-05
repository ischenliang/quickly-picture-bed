<template>
  <wiki-icon :size="size" :color="color">
    <svg t="1693878652630" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M426.666667 170.666667H170.666667c-47.146667 0-84.906667 38.186667-84.906667 85.333333L85.333333 768c0 47.146667 38.186667 85.333333 85.333334 85.333333h682.666666c47.146667 0 85.333333-38.186667 85.333334-85.333333V341.333333c0-47.146667-38.186667-85.333333-85.333334-85.333333H512l-85.333333-85.333333z" p-id="4270"></path></svg>
  </wiki-icon>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
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