<template>
  <span class="c-icon">
    <slot></slot>
  </span>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
interface Props {
  color?: string
  size?: string | number
}
const props = withDefaults(defineProps<Props>(), {
  color: '#606266',
  size: '16'
})
const color = computed(() => {
  return props.color
})
const size = computed(() => {
  return parseInt(props.size as string) + 'px'
})
</script>
<style lang="scss">
.c-icon {
  width: 100%;
  height: 100%;
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  font-size: v-bind(size);
  color: v-bind(color);
  svg {
    height: 1em;
    width: 1em;
    fill: v-bind(color);
  }
}
</style>