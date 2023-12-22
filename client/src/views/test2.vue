<template>
  <div>
    <!-- 拖拽排序列表 -->
    <!-- <ul ref="sortableListRef">
      <li v-for="item in items" :key="item.id" :data-id="item.id">{{ item.name }}</li>
    </ul> -->
    <component :is="customElement"></component>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const customElement = ref('')

// @ts-ignore
const url = '../image2base64.js'
import(/* @vite-ignore */url).then((res) => {
  const { name, handler } = res.default
  customElement.value = name
  window.customElements.define(name, handler)
})
</script>

<style lang="scss">
ul {
  padding: 20px;
  li {
    height: 40px;
    background: #ccc;
    margin-bottom: 10px;
    padding: 10px 20px;
  }
}
</style>