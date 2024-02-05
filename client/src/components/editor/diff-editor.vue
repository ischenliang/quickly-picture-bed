<template>
  <div id="monaco"></div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import * as monaco from 'monaco-editor'

/**
 * 实例
 */
interface Props {
  language?: string
  oldValue: string
  value: string
}
const props = withDefaults(defineProps<Props>(), {
  language: 'json',
  value: '',
  oldValue: ''
})

/**
 * 生命周期
 */
let editor = null
onMounted(() => {
  editor = monaco.editor.createDiffEditor(document.getElementById('monaco') as HTMLElement, {
    automaticLayout: true, // 自适应布局  
    theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
    foldingStrategy: 'indentation',
    renderLineHighlight: 'all', // 行亮
    selectOnLineNumbers: true, // 显示行号
    minimap:{
      enabled: true,
    },
    wordWrap: 'on',
    readOnly: true, // 只读
    fontSize: 16, // 字体大小
    scrollBeyondLastLine: false, // 取消代码后面一大段空白 
    overviewRulerBorder: false, // 不要滚动条的边框
    enableSplitViewResizing: false,
    renderSideBySide: true // 是否启用两边比较，false：使用行内比较
  })

  editor.setModel({
    original: monaco.editor.createModel(props.oldValue, props.language),
    modified: monaco.editor.createModel(props.value, props.language)
  })
})
</script>

<style lang="scss">
#monaco {
  width: 100%;
  height: 400px;
}
</style>