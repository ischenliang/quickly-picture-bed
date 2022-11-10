<template>
  <div id="bytemd-viewer"></div>
</template>

<script lang="ts" setup>
import * as bytemd from 'bytemd';
// import 'bytemd/dist/index.min.css';
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import breaks from '@bytemd/plugin-breaks';
import highlight from '@bytemd/plugin-highlight';
import footnotes from '@bytemd/plugin-footnotes';
import frontmatter from '@bytemd/plugin-frontmatter';
import gfm from '@bytemd/plugin-gfm';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import gemoji from '@bytemd/plugin-gemoji';
import './markdown.css'
// arknights awesome-green channing-cyan condensed-night-purple cyanosis devui-blue juejin
import 'juejin-markdown-themes/dist/devui-blue.css'
import { getCurrentInstance, onMounted, Ref, ref, nextTick, toRaw } from 'vue';

interface Props {
  value?: string
  placeholder?: string
  plugins?: any
  previewDebounce?: number
  locale?: any
  maxLength?: number
  mode?: 'auto' | 'split' | 'tab'
}


const editor: Ref<bytemd.Viewer> = ref(null)
const instance = getCurrentInstance();
const props = withDefaults(defineProps<Props>(), {
  value: "",
  plugins: [
    breaks(),
    highlight(),
    footnotes(),
    frontmatter(),
    gfm(),
    mediumZoom(),
    gemoji(),
  ]
});

onMounted(() => {
  editor.value = new bytemd.Viewer({
    // @ts-ignore
    target: instance?.subTree.el,
    // @ts-ignore
    props,
  });
  nextTick(() => {
    window.dispatchEvent(new Event('resize'))
  })

  // https://github.com/bytedance/bytemd/issues/33
  // 处理h1-h6即可。
  // let hast: any = '' // 存放所有的数据
  // bytemd.getProcessor({
  //   plugins: [
  //     {
  //       rehype: (p) =>
  //         p.use(() => (tree) => {
  //           hast = tree
  //         }),
  //     },
  //   ],
  // }).processSync(props.value)
})
</script>

<style lang="scss">
</style>