<template>
  <div>
    <div id="monaco" style="width: 600px;height: 400px;"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker'
import * as monaco from 'monaco-editor'

onMounted(() => {
  // const editor = monaco.editor.create(document.getElementById('monaco'), {
  //   // value: `console.log("hello,world")`,
  //   // language: "javascript"
  // })
  monaco.editor.create(document.getElementById('monaco') as HTMLElement, {
    value: 'const a = 1', // 编辑器初始显示文字
    language: 'go', // 语言支持自行查阅demo
    automaticLayout: true, // 自适应布局  
    theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
    foldingStrategy: 'indentation',
    renderLineHighlight: 'all', // 行亮
    selectOnLineNumbers: true, // 显示行号
    minimap:{
        enabled: false,
    },
    readOnly: false, // 只读
    fontSize: 16, // 字体大小
    scrollBeyondLastLine: false, // 取消代码后面一大段空白 
    overviewRulerBorder: false, // 不要滚动条的边框  
  })
})
</script>

<style lang="scss">

</style>