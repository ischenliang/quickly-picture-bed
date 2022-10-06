<template>
  <!-- <Editor :value="value" :plugins="plugin" /> -->
  <component
    :is="Editor"
    :value="value"
    @change="handleChange"></component>
</template>

<script lang="ts" setup>
import 'bytemd/dist/index.css'
import { ref, toRaw } from 'vue';
// import { Editor } from '@bytemd/vue-next'
import * as bytemd from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import breaks from '@bytemd/plugin-breaks';
import highlight from '@bytemd/plugin-highlight';
import footnotes from '@bytemd/plugin-footnotes';
import frontmatter from '@bytemd/plugin-frontmatter';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import gemoji from '@bytemd/plugin-gemoji';
const plugins = [
  gfm(),
  breaks(),
  highlight(),
  footnotes(),
  frontmatter(),
  mediumZoom(),
  gemoji()
]
const value = ref('# 赫赫')

const Editor = toRaw(bytemd.Editor)

const handleChange = (v) => {
  console.log(v)
}
</script>

<style lang="scss">

</style>