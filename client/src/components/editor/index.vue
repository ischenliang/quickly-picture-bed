<template>
  <div id="monaco"></div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import ace from 'ace-builds'
import 'ace-builds/css/ace.css'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-one_dark'

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
let editor = null
const init = ref(false)
onMounted(() => {
  editor = ace.edit(document.querySelector('#monaco'), {
    mode: 'ace/mode/json', // 语言
    theme: 'ace/theme/one_dark', // 主题
    highlightActiveLine: false, // 高亮当前行
    highlightSelectedWord: true, // 高亮选中文本
    readOnly: false, // 是否只读
    cursorStyle: 'ace', // 光标样式，可选值ace|slim|smooth|wide
    value: props.modelValue, // 编辑器内容
    fontSize: 16, // 字体大小
    tabSize: 2, // tabsize大小
    placeholder: '输入你的code...', // 占位提示
    highlightGutterLine: false, // 高亮边线
    showPrintMargin: true, // 显示打印边距
    printMarginColumn: 80, // 设置页边距
    showGutter: true, // 显示行号区域
    useWorker: false, // 使用辅助对象
    wrap: false, // 换行
    showFoldWidgets: false, // 是否显示折叠
  })
  // 监听内容变化
  editor.on('change', (delta: any) => {
    editorValue.value = editor.getValue()
  })
})

watch(() => props.modelValue, (val, old) => {
  nextTick(() => {
    if (val && val !== old && !init.value) {
      editor && editor.setValue(val, -1)
      init.value = true
    }
  })
}, {
  immediate: true
})
</script>

<style lang="scss">
#monaco {
  width: 100%;
  height: 400px;
}
</style>