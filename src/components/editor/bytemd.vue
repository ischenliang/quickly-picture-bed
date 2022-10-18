<script setup lang="ts">
import { ref, onMounted, getCurrentInstance, watch } from 'vue';
import * as bytemd from 'bytemd';
import 'bytemd/dist/index.min.css';
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import breaks from '@bytemd/plugin-breaks';
import highlight from '@bytemd/plugin-highlight';
import footnotes from '@bytemd/plugin-footnotes';
import frontmatter from '@bytemd/plugin-frontmatter';
import gfm from '@bytemd/plugin-gfm';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import gemoji from '@bytemd/plugin-gemoji';

interface ImageAttr { title: string, url: string, alt: string }

interface Props {
  value?: string,
  placeholder?: string,
  plugins?: any,
  previewDebounce?: number,
  locale?: any,
  uploadImages?: (files: [File]) => [ImageAttr],
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: undefined,
  placeholder: '',
  previewDebounce: 200,
  uploadImages: undefined,
  value: '',
  locale: zhHans,
  plugins: [
    breaks(),
    highlight(),
    footnotes(),
    frontmatter(),
    gfm(),
    mediumZoom(),
    gemoji(),
  ],
});

const emit = defineEmits<{ (e: 'change', id: string): void, (e: 'update:value', id: string): void }>();
const editor = ref<bytemd.Editor>(null);
const instance = getCurrentInstance();

onMounted(() => {
  editor.value = new bytemd.Editor({
    target: instance?.subTree.el,
    props,
  });
  editor.value.$on('change', (e: { detail: { value: string; }; }) => {
    emit('change', e.detail.value);
    emit('update:value', e.detail.value);
  });
});

watch(props, (newValue) => {
  editor.value.$set(Object.fromEntries(Object.entries(newValue).filter((v) => v)));
});
</script>
  
<template>
  <div class="bytemd-container" />
</template>

<style lang="scss" scoped>
.bytemd-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
<style lang="scss">
.bytemd {
  width: 100%;
  height: 100% !important;
  min-height: 300px !important;
  display: flex;
  flex-direction: column;
}
</style>