<template>
  <div :class="['message-item', { reverse: reverse }]">
    <div class="message-item-avatar">
      <el-image src="https://chatgpt.quxuetrip.com/slices/chatgpt/ai_dark.webp"></el-image>
    </div>
    <div class="message-item-info">
      <div class="info-main">
        <div class="info-time">2023/3/26 15:26:05</div>
        <div class="info-text">
          <div class="markdown-body" v-html="renderText"></div>
          <div class="info-actions"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'juejin-markdown-themes/dist/devui-blue.css'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import { computed } from '@vue/reactivity';
import { watch } from 'vue';
interface Props {
  reverse?: boolean
  text: string
}
/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  reverse: false,
  text: ''
})

/**
 * 变量
 */
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
// 使用插件
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
// 生成后的内容
const renderText = computed(() => {
  return mdi.render(props.text)
})

watch(() => props.text, (val) => {
  console.log(val)
})


/**
 * 逻辑
 */
// 高亮代码
function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}
</script>

<style lang="scss" scoped>
.message-item {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  &-avatar {
    width: 50px;
    margin-right: 10px;
  }
  &-info {
    flex: 1;
    display: flex;
    .info-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .info-time {
        color: rgb(180 187 196);
      }
      .info-text {
        max-width: 90%;
        margin-top: 10px;
        background: rgb(244 246 248);
        padding: 10px 15px;
        border-radius: 8px;
        position: relative;
        .info-actions {
          position: absolute;
          bottom: 0;
          right: -25px;
          width: 20px;
          height: 50px;
          background: #ccc;
          display: none;
        }
      }
    }
  }

  &.reverse {
    flex-direction: row-reverse;
    .message-item-avatar {
      margin-right: 0px;
      margin-left: 10px;
    }
    .message-item-info {
      // justify-content: flex-end;
      flex-direction: row-reverse;
      .info-time {
        text-align: right;
      }
      .info-main {
        align-items: flex-end;
        .info-actions {
          left: -25px;
        }
        .info-text {
          background-color: rgb(75 158 95);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message-item .markdown-body {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  color: #24292f;
  overflow: hidden !important;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  p {
    margin-bottom: 16px;
    margin-top: 0 !important;
  }
  > *:last-child {
    margin-bottom: 0!important;
  }
  ol {
    list-style-type: decimal;
    padding-left: 2em;
  }
}
</style>