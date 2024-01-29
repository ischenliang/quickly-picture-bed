<template>
  <div class="uplog-md" v-loading="loading">
    <md-preview :value="doc_md"></md-preview>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import mdPreview from './md-preview.vue';
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
const loading = ref(false)

/**
 * 逻辑处理
 */
function loadData () {
  loading.value = true
  // 处理更新日志和READEME.md
  fetch(`${url.value}/changlog.md`)
    .then(res => res.text())
    .then(res => {
      doc_md.value = res
      loading.value = false
    })
}
loadData()


</script>
<style lang="scss">
.uplog-md {
  width: 100%;
  height: 100%;
}
</style>