<template>
  <div style="padding: 10px;">
    <!-- <custom-elme :title="'张三'"></custom-elme> -->
    <!-- <component :is="'custom-elme'" :title="'张三'"></component> -->

    <custom-button type="primary"></custom-button>
  </div>
</template>

<script lang="ts" setup>
import { defineCustomElement } from 'vue';

// 方式一
// import customEl from './custom-el.vue';
// customElements.define('custom-elme', defineCustomElement(customEl))

// 方式二：需要在vite.config.js中配置alias: { 'vue': 'vue/dist/vue.esm-bundler.js' }
// import customElement from './custom-element';
// customElements.define('custom-elme', defineCustomElement(customElement))


// 方式一：直接导入组件
// import { CButton, CSwitch } from './index.js'
// import './bundle.css'


// 方式二：通过defineCustomElement方式定义为自定义元素
// import('./index.js').then(async (res: any) => {
//   customElements.define('custom-button', defineCustomElement({
//     ...res.default,
//     styles: [await (await fetch('/bundle.css')).text()]
//   }))
// })


// 第二种方式：先请求代码内容，然后通过new Function()方式来实现“script src="/index.js"”功能
// fetch('/index.js').then(res => res.text()).then(async (res) => {
//   const text = new Function(res)
//   text()
//   // @ts-ignore
//   const myPlugin: any = window.MyPlugin
//   // 需要注意的是: 这里不能使用 import {defineCustomElement} from 'vue'的defineCustomElement，而是直接使用script src="vue.global.prod.js"中的window.Vue.defineCustomElement，否则会报错Uncaught TypeError: Cannot read properties of null (reading 'isCE')
//   // @ts-ignore
//   customElements.define('custom-button', window.Vue.defineCustomElement({
//     ...myPlugin.component,
//     styles: [await (await fetch('/bundle.css')).text()]
//   }))
// })


fetch('/index2.js').then(res => res.text()).then(async (res) => {
  const text = new Function(res)
  text()
  // @ts-ignore
  const myPlugin: any = window.MyPlugin
  // 需要注意的是: 这里不能使用 import {defineCustomElement} from 'vue'的defineCustomElement，而是直接使用script src="vue.global.prod.js"中的window.Vue.defineCustomElement，否则会报错Uncaught TypeError: Cannot read properties of null (reading 'isCE')
  // @ts-ignore
  customElements.define('custom-button', window.Vue.defineCustomElement({
    ...myPlugin.component,
    styles: [await (await fetch('/bundle.css')).text()]
  }))
})
</script>

<style lang="scss">
</style>