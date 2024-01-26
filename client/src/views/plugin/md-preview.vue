<template>
  <bytemd-viewer
    class="bytemd-viewer markdown-body"
    :value="value"
    :plugins="plugins"
    ref="viewerRef" />
</template>
<script lang="ts" setup>
import 'bytemd/dist/index.css'
import gfm from '@bytemd/plugin-gfm'
import breaks from '@bytemd/plugin-breaks'
import formatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import zoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import { Viewer as bytemdViewer } from '@bytemd/vue-next'

interface Props {
  value: string
}

const plugins = [
  gfm(),
  breaks(),
  formatter(),
  gemoji(),
  highlight(),
  zoom(),
  mermaid(),
  math()
]

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  value: ''
})
</script>
<style lang="scss">
.markdown-body {
  min-height: 400px;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  color: var(--el-text-color-primary);
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
  img {
    display: block;
  }
}
</style>