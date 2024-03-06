<template>
  <bytemd-viewer
    class="bytemd-viewer markdown-body"
    :value="value"
    :plugins="plugins"
    ref="viewerRef"
    @scroll="handleScroll" />
  <div class="bytemd-navigator">
    <div class="bytemd-navigator-title">本页目录</div>
    <div class="bytemd-navigator-main">
      <ul class="nav-list">
        <li
          v-for="(item, index) in catalogs"
          :class="['level-' + item.level, index === anchor ? 'active' : '']"
          :data-level="index"
          :title="item.text"
          @click="gotoHash(`#head-${index}`)">
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>
  </div>
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
import { getProcessor } from 'bytemd'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findIndex } from 'lodash'


const props = defineProps<{
  value: string
}>()
const emit = defineEmits(['update:value'])
const route = useRoute()
const router = useRouter()
const anchor = ref(0)


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
const catalogs = ref([])
// 获取内容
function getCatalogData (val) {
  getProcessor({
    plugins: [
      {
        rehype: p => p.use(() => tree => {
          if (tree && tree.children.length) {
            createNavigator(tree)
          }
        })
      }
    ]
  }).processSync(val)
}
// 创建导航目录
function createNavigator (tree) {
  const items = []
  tree.children.filter(el => el.type === 'element').forEach((el, index) => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.tagName) && el.children.length > 0) {
      const level = el.tagName.charAt(1)
      const text = stringifyHeading(el)
      items.push({
        level: level,
        text: text
      })
    }
  })
  catalogs.value = items
}
function stringifyHeading (node) {
  let result = ''
  node.children.forEach(el => {
    if (el.type === 'text') {
      result += el.value
    }
  })
  return result
}
// 生成id
function generateId () {
  const dom = document.querySelector('#bytemd-container').querySelector('.markdown-body')
  const children = Array.from(dom.children).filter(el => {
    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)
  })
  children.forEach((el: HTMLElement, index) => {
    el.setAttribute('id', `head-${index}`)
    if (catalogs.value[index]) {
      catalogs.value[index].offsetTop = el.offsetTop
    }
  })
}
// 跳转到hash值地方: 实现锚点功能
function gotoHash (hash) {
  nextTick(() => {
    if (hash) {
      const targetEl = document.querySelector(hash) as HTMLDivElement
      if (targetEl) {
        const offsetTop = targetEl.offsetTop
        document.querySelector('.bytemd-viewer').scrollTo(0, offsetTop - 20)
      }
    }
  })
}
// 监听滚动事件
function handleScroll (e) {
  const scrolltop = e.target.scrollTop
  for (let i = 0; i < catalogs.value.length; i++) {
    if (catalogs.value[i].offsetTop <= scrolltop + 20) {
      anchor.value = i
    }
  }
}


watch(() => props.value, (val) => {
  if (val) {
    nextTick(() => {
      getCatalogData(val)
      generateId()
      gotoHash(route.hash)
    })
  }
}, {
  immediate: true
})

onMounted(() => {
  nextTick(() => {
    generateId()
  })
})
</script>
<style lang="scss" scoped>
$padding: 16px;
.bytemd-viewer {
  width: calc(100% - 250px);
  height: 100%;
  padding: 20px;
  overflow: auto;
  position: relative;
  background: #fff;
}
.bytemd-navigator {
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid #ddd;
  background: #fff;
  &-title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1rem;
    color: #333;
    padding: 0 1rem;
  }
  &-main {
    flex: 1;
    overflow: hidden auto;
    .nav-list {
      padding: 1rem 0;
      overflow: hidden;
      li {
        line-height: 32px;
        font-size: 14px;
        color: #666;
        position: relative;
        padding: 0 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        span {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.active {
          font-weight: 700;
          color: #42b883;
          background: #f6f8fa;
          &::after {
            content: "";
            width: 4px;
            height: 100%;
            background: #42b883;
            border-radius: 4px;
            position: absolute;
            left: 0;
          }
        }
        @for $i from 1 through 6 {
          &.level-#{$i} {
            padding-left: calc(1rem + $padding * ($i - 1));
          }
        }
        &:hover {
          a {
            color: #10b981;
          }
        }
      }
    }
  }
}
</style>