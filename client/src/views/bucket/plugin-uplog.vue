<template>
  <div class="plugin-uplog">
    <markdown-preview :value="doc_md"></markdown-preview>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import markdownPreview from './markdown-preview.vue';
import { PluginLoadUrl } from '@/global.config';

interface Props {
  plugin_name?: string // 插件名称
  plugin_version?: string // 插件版本号
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  plugin_name: '',
  plugin_version: ''
})

/**
 * 变量
 */
const url = computed(() => {
  return `${PluginLoadUrl}${props.plugin_name}@${props.plugin_version}`
})
const doc_md = ref('')

/**
 * 逻辑处理
 */
function loadData () {
  // 处理更新日志和READEME.md
  fetch(`${url.value}/changlog.md`)
    .then(res => res.text())
    .then(res => {
      doc_md.value = res
    })
}
loadData()


</script>
<style lang="scss">
.plugin-uplog {
  
}
</style>