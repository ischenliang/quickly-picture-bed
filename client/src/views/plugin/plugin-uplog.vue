<template>
  <div class="plugin-uplog-md">
    <uplog-md :plugin_name="detail.name" :plugin_version="detail.version"></uplog-md>
  </div>
</template>
<script lang="ts" setup>
import { PluginInter } from '@/typings/interface';
import UplogMd from './uplog-md.vue'

interface Props {
  detail: PluginInter
}

const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as PluginInter)
})
</script>
<style lang="scss">
.plugin-uplog-md {
  min-height: 100%;
  overflow: hidden;
}
</style>