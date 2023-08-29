<template>
  <div class="markdown-body" v-html="renderText"></div>
</template>
<script lang="ts" setup>
import 'juejin-markdown-themes/dist/devui-blue.css'
import MarkdownIt from 'markdown-it'
import MarkdownLinkAttributes from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { computed } from 'vue'
interface Props {
  value: string
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  value: ''
})

// 初始化markdown-it
const mdi = new MarkdownIt({
  linkify: true,
  highlight(code: string, language: string) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(lang, code, true).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})
mdi.use(MarkdownLinkAttributes, {
  pattern: /^https?:/,
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})
// 使用插件
// mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
// 生成后的内容
const renderText = computed(() => {
  return mdi.render(props.value)
})

// 高亮代码
function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
  // return `<pre class="code-block-wrapper"><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}
</script>
<style lang="scss">
.markdown-body {
  min-height: 400px;
}
</style>