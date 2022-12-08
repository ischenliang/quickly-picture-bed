<template>
  <div>
    <monaco-editor
      v-model="value"
      language="javascript"
      style="width: 100%;height: 600px;">
    </monaco-editor>
    <el-button type="primary" @click="handleClick">确定</el-button>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import MonacoEditor from '@/components/editor/index.vue'
import { ref } from 'vue';
// 注意：这里需要设计成立即执行函数，如果直接使用对象则是不支持的
const value = ref('(() => {})()')

const handleClick = () => {
  // 沙箱代码
  const config = {
    host: 'https://upload.qiniup.com/',
    username: 'ischenliang',
    repo: 'imgs',
    path: 'img/',
    token: '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',
    branch: 'main'
  }
  const file = {
    filename: '哇哈哈哈.png'
  }

  // 第一步：将定义好的插件中的${config.xxx}和${file.xxx}替换成真实的数据(即全局config和file中的数据)
  // 注意：不要替换res.xxx的数据，此时还未拿到数据
  const tmp = value.value.replace(/\$\{((config|file).*?)\}/g, (v, key) => {
    const keys = key.split('.')
    if (keys[0] === 'config') {
      return config[keys[1]]
    }
    if (keys[0] === 'file') {
      return file[keys[1]]
    }
  })
  
  // 第二步：将定义好的插件转成js对象
  const plugin = (new Function(`return ${tmp}`)())()


  // 第三步：为了解决直接调用axios报错问题，动态在uploader上挂载axios，然后才可以在内部使用this['axios']调用
  plugin.uploader.axios = axios

  // 第四步：将转好的js插件对象，调用uploader.request方法获取对应的请求配置
  // console.log(plugin.uploader.request.toString()) // 将函数转成字符串
  console.log(plugin)
  plugin.uploader.request()
}
</script>

<style lang="scss">

</style>