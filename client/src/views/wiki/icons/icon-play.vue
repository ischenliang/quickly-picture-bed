<template>
  <wiki-icon :size="size" :color="color">
    <svg t="1693879787380" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M924 113.7H101c-19.9 0-36 16.1-36 36s16.1 36 36 36h26.1v554.1c0 19.9 16.1 36 36 36h108.1l-74.8 75.8c-14 14.2-13.8 37 0.4 50.9 7 6.9 16.1 10.4 25.3 10.4 9.3 0 18.6-3.6 25.6-10.7l124.6-126.4h280.1L777 902.1c7 7.1 16.3 10.7 25.6 10.7 9.1 0 18.3-3.5 25.3-10.4 14.2-14 14.3-36.8 0.4-50.9l-74.8-75.8h108.1c19.9 0 36-16.1 36-36v-554H924c19.9 0 36-16.1 36-36s-16.1-36-36-36z m-98.4 590.1H199.1V185.7h626.5v518.1z" p-id="4071"></path><path d="M440.4 606.2l221.5-143.1c1.9-1.2 3.5-2.9 4.8-4.8 4.8-7.4 2.7-17.3-4.8-22.1L440.4 293.1c-2.6-1.7-5.6-2.6-8.7-2.6-8.8 0-16 7.2-16 16v286.2c0 3.1 0.9 6.1 2.6 8.7 4.7 7.5 14.6 9.6 22.1 4.8z" p-id="4072"></path></svg>
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