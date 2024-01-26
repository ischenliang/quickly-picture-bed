<template>
  <div :class="['message-item', { reverse: reverse }]">
    <div class="message-item-avatar">
      <el-image :src="userAvatar"></el-image>
    </div>
    <div class="message-item-info">
      <div class="info-main">
        <div class="info-time">{{ time }}</div>
        <div class="info-text">
          <div class="progress-4" v-if="loading"></div>
          <div v-else class="markdown-body" v-html="renderText"></div>
          <div class="info-actions">
            <!-- <span class="info-action-item" title="重新回答">
              <i class="iconfont icon-refresh"></i>
            </span> -->
            <el-popover
              :placement="reverse ? 'left' : 'right'"
              :width="100"
              :popper-class="{ 'chatgpt-popover': true, reverse: reverse }"
              trigger="hover">
              <template #reference>
                <span class="info-action-item">
                  <i class="iconfont icon-More"></i>
                </span>
              </template>
              <div class="chatgpt-dropdown">
                <div class="chatgpt-dropdown-option" @click="handleCommand('copy')">
                  <i class="iconfont icon-copy"></i>
                  <span>复制</span>
                </div>
                <div class="chatgpt-dropdown-option" @click="handleCommand('delete')">
                  <i class="iconfont icon-delete"></i>
                  <span>删除</span>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import MarkdownLinkAttributes from 'markdown-it-link-attributes'
// import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import { computed } from 'vue';
import { watch } from 'vue';
interface Props {
  reverse?: boolean
  text: string
  time?: string
  loading?: boolean
  avatar?: string
}
/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  reverse: false,
  text: '',
  time: '',
  loading: true,
  avatar: ''
})
const emits = defineEmits(['command'])

/**
 * 变量
 */
// 头像
const userAvatar = computed(() => {
  return props.reverse ? props.avatar : new URL(`./ai_dark.webp`, import.meta.url).href
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
  if (props.reverse) {
    return props.text
  } else {
    return mdi.render(props.text)
  }
})

watch(() => props.text, (val) => {
  // console.log(val)
})


/**
 * 逻辑
 */
// 高亮代码
function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
  // return `<pre class="code-block-wrapper"><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}
// 命令回调
function handleCommand (type) {
  emits('command', type)
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
    flex-shrink: 0;
    .el-image {
      border-radius: 50% !important;
      border: 1px solid #ddd;
    }
  }
  &-info {
    flex: 1;
    display: flex;
    overflow: hidden;
    .info-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: hidden;
      .info-time {
        color: rgb(180 187 196);
      }
      .info-text {
        max-width: 90%;
        margin-top: 5px;
        background: #feffff;
        border: 1px solid #e5e6e7;
        padding: 10px 10px;
        border-radius: 3px;
        position: relative;
        // overflow: hidden;
        .info-actions {
          position: absolute;
          bottom: 0;
          right: -25px;
          width: 20px;
          // height: 50px;
          // background: #ccc;
          // display: none;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          .info-action-item {
            font-size: 12px;
            cursor: pointer;
            color: rgb(212 212 212);
            + .info-action-item {
              margin-top: 5px;
            }
          }
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
          // background-color: rgb(75 158 95);
          background-color:#fff;
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
  color: var(--el-text-color-primary);
  overflow: hidden !important;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
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
.progress-4 {
  width:120px;
  height:20px;
  -webkit-mask:linear-gradient(90deg,#000 70%,#0000 0) 0/20%;
  background: linear-gradient(#000 0 0) 0/0% no-repeat #ddd;
  animation:p4 2s infinite steps(6);
}
@keyframes p4 {
  100% {background-size:120%}
}

.el-popper.chatgpt-popover {
  padding: 0px !important;
  min-width: 0px !important;
  margin: 0 0 0 -8px;
  &.reverse {
    margin: 0 -8px 0 0;
  }
  .chatgpt-dropdown {
    padding: 5px;
    .chatgpt-dropdown-option {
      height: 35px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #000;
      cursor: pointer;
      span {
        margin-left: 10px;
      }
      &:hover {
        background-color: rgb(244 246 248);
        border-radius: 4px;
      }
    }
  }
}
</style>