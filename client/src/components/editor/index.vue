<template>
  <div id="monaco"></div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import * as monaco from 'monaco-editor'

/**
 * 实例
 */
interface Props {
  // value?: string,
  language?: string,
  modelValue: any
}
const props = withDefaults(defineProps<Props>(), {
  // value: '',
  language: 'json',
  modelValue: ''
})
const emit = defineEmits(['update:modelValue'])


/**
 * 变量
 */
const editorValue = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

/**
 * 生命周期
 */
onMounted(() => {
  // editor.value = 
  const editor = monaco.editor.create(document.getElementById('monaco') as HTMLElement, {
    value: '', // 编辑器初始显示文字
    language: props.language, // 语言支持自行查阅demo
    automaticLayout: true, // 自适应布局  
    theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
    foldingStrategy: 'indentation',
    renderLineHighlight: 'all', // 行亮
    selectOnLineNumbers: true, // 显示行号
    minimap:{
      enabled: true,
    },
    wordWrap: 'on',
    readOnly: false, // 只读
    fontSize: 16, // 字体大小
    scrollBeyondLastLine: false, // 取消代码后面一大段空白 
    overviewRulerBorder: false, // 不要滚动条的边框
    tabSize: 2
  })
  editor.setValue(editorValue.value)
  // 监听值的变化
  editor.onDidChangeModelContent((event) => {
    editorValue.value = editor.getValue()
  });
})
</script>

<style lang="scss">
#monaco {
  width: 100%;
  height: 400px;
}
</style>