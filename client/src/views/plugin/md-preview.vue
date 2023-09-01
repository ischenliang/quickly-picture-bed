<template>
  <div class="markdown-body" v-html="renderText"></div>
</template>
<script lang="ts" setup>
import 'juejin-markdown-themes/dist/devui-blue.css'
import MarkdownIt from 'markdown-it'
import MarkdownLinkAttributes from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { useCopyText, useCtxInstance } from '@/hooks/global'
import { computed, onMounted, onUpdated } from 'vue'
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

function useCopyCode(ctx) {
  function copyCodeBlock() {
    const codeBlockWrapper = document.querySelectorAll('.code-block-wrapper')
    codeBlockWrapper.forEach((wrapper) => {
      const copyBtns = wrapper.querySelectorAll('.code-block-header__copy')
      const codeBlocks = wrapper.querySelectorAll('.code-block-body')
      copyBtns.forEach((copyBtn: HTMLElement, index) => {
        if (copyBtn && codeBlocks[index]) {
          copyBtn.onclick = () => {
            useCopyText(ctx, codeBlocks[index].textContent ?? '')
          }
        }
      })
    })
  }
  onMounted(() => copyCodeBlock())
  onUpdated(() => copyCodeBlock())
}
useCopyCode(useCtxInstance())
</script>
<style lang="scss">
.markdown-body {
  min-height: 400px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  color: #24292f;
  overflow: hidden !important;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  h1 {
    text-align: left;
    margin-top: 35px;
  }
  p {
    margin-bottom: 16px;
    margin-top: 0 !important;
  }
  pre>code {
    padding: 20px 12px 15px !important;
  }
  > *:last-child {
    margin-bottom: 0!important;
  }
  ol {
    list-style-type: decimal;
    padding-left: 2em;
  }
  .code-block-wrapper {
    position: relative;
    .code-block-header {
      position: absolute;
      top: 0px;
      right: 0px;
      color: #b3b3b3;
      font-size: 12px;
      user-select: none;
      span {
        margin-right: 8px;
        cursor: pointer;
        &.code-block-header__copy:hover {
          color: #18a058;
        }
      }
    }
  }
}
</style>