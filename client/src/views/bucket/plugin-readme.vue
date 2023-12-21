<template>
  <div class="plugin-readme">
    <md-preview :value="doc_md"></md-preview>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import mdPreview from '@/views/plugin/md-preview.vue';
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
  return `${PluginLoadUrl}${props.plugin_name}/${props.plugin_version}/files`
})
const doc_md = ref('')

/**
 * 逻辑处理
 */
function loadData () {
  // 处理更新日志和READEME.md
  fetch(`${url.value}/README.md`)
    .then(res => res.text())
    .then(res => {
      doc_md.value = res
    })
}

watch(() => props.plugin_name, () => {
  loadData()
}, {
  immediate: true,
  deep: true
})

</script>
<style lang="scss">
.plugin-readme {}
</style>