<template>
  <div class="plugin-runcode">
  </div>
</template>
<script lang="ts" setup>
import { PluginLoadUrl } from '@/global.config';
import { PluginInter } from '@/typings/interface';
import { computed } from 'vue';
interface Props {
  detail: PluginInter
}
const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as PluginInter)
})
const url = computed(() => {
  return `${PluginLoadUrl}${props.detail.name}/${props.detail.user_plugin.version}/files`
})

function resolvePlugin () {
  fetch(url.value + '/dist/main.js').then(res => res.text()).then(async (res) => {
    const plugin = new Function(res)
    plugin()
    // @ts-ignore
    const myPlugin: any = window.MyPlugin
    const { name, component } = myPlugin
    const tagName = 'custom-' + name
    let el: HTMLElement
    if (!customElements.get(tagName)) {
      // @ts-ignore
      customElements.define('custom-' + name, window.Vue.defineCustomElement({
        ...component,
        styles: [await (await fetch(url.value + '/dist/style.css')).text()]
      }))
    }
    el = document.createElement('custom-' + name)
    el.setAttribute('id', name)
    document.querySelector('.plugin-runcode').appendChild(el)
  })
}
resolvePlugin()
</script>
<style lang="scss">
.plugin-runcode {
}
</style>