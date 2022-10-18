<template>
  <div>
    <input type="file" multiple @change="handleChange">
    <div style="padding: 20px;">
      <el-button type="primary" @click="handleClick">粘贴</el-button>
    </div>
    <div v-if="src">
      <img :src="src" alt="">
    </div>
  </div>
</template>

<script lang="ts" setup>
import gitee from '@/hooks/bucket/gitee'
import qiniu from '@/hooks/bucket/qiniu'
import github from '@/hooks/bucket/github'
import leancloud from '@/hooks/bucket/leancloud'
import { useFileToBase64, useGetImageSize } from '@/hooks/global'
import { onMounted, ref } from 'vue'
import { read } from 'fs'

const src = ref('')
  
// 自定义事件
const pastEvent = new CustomEvent('past', {
  detail: {}
})
const handleClick = (event) => {
  // @ts-ignore
  // const clipboardData = window.clipboardData
  // console.log(clipboardData)
  // navigator.clipboard.readText().then(res => {
  //   console.log(res)
  // })

  document.dispatchEvent(pastEvent)


  // 缺点：兼容性不足，火狐浏览器上window.navigator.clipboard.read不存在
  window.navigator.clipboard.read().then(async res => {
    // 粘贴板可能存在多个复制记录：例如复制vscode中的代码，会将样式也复制
    for (let clipboardItem of res) {
      for (const type of clipboardItem.types) {
        // console.log(type)
        const item = await clipboardItem.getType(type)
        if (item) {
          console.log(await item.text())
        }
      }
    }

    // 获取粘贴板中的图片
    // res[0].getType('image/png').then(blob => {
    //   // 方式一
    //   // const file = new File([blob], 'demo.png')
    //   // useFileToBase64(file, true).then(data => {
    //   //   console.log(data)
    //   // })

    //   // 方式二
    //   // const reader = new FileReader()
    //   // reader.onload = (e) => {
    //   //   console.log(e.target.result)
    //   // }
    //   // reader.readAsDataURL(blob)


    //   // 方式三
    //   const URLObj = window.URL || window.webkitURL
    //   const source = URLObj.createObjectURL(blob)
    //   src.value = source
    // })
  })
}

onMounted(() => {
  // 默认粘贴事件
  document.addEventListener('paste', (event) => {
    // @ts-ignore
    const clipboardData: DataTransfer = event.clipboardData || window.clipboardData
    const items: DataTransferItemList = clipboardData.items

    // 读取最后一次的内容
    // console.log('11', clipboardData.getData('text/plain'))

    // 读取内容: 遍历读取
    // for (let i = 0; i < items.length; i++) {
    //   items[i].getAsString((val) => {
    //     console.log('复制的文本内容:', val)
    //   })
    // }

    // 搜索剪切板items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      // 文件格式
      if (item.kind === 'file') {
        // 匹配图片类型
        if (item.type.indexOf('image') !== -1) {
          // https://blog.csdn.net/LonewoIf/article/details/90701066
          const file: File = item.getAsFile()
          if (file.size === 0) {
            return
          }
          console.log(file)
        }
      }
      
      // 文本格式
      if (item.kind === 'string') {
        item.getAsString((val) => {
          console.log('文本内容：', val)
        })
      }
    }
  })

  document.addEventListener('past', (e: ClipboardEvent) => {
    // console.log(e)
  })
})


const handleChange = async (e) => {
  // const res = await gitee.uploadFile('633e94a9cd84e144d595292b', e.target.files)
  // console.log(res)

  // qiniu.uploadFile('633e8a1331a5a915d528eab5', e.target.files)
  //   .then(res => {
  //     console.log(res)
  //   })

  // github.uploadFile('6343a539cd84e144d59c44af', e.target.files)
  //   .then(res => {
  //     console.log(res)
  //   })

  // leancloud.uploadFile('6343d452cd84e144d59c9150', e.target.files)
  //   .then(res => {
  //     console.log(res)
  //   })










  // useLocalBucket(e.target.files).then(res => {
  //   console.log('result', res)
  // })


  // useGiteeBucket({
  //   username: 'itchenliang',
  //   repo: 'img',
  //   branch: 'master',
  //   token: '52cdad229e4e56b1a0f9bc7748852ef5',
  //   path: '/demo',
  //   customPath: '/img/1',
  //   commit_messages: 'upload test'
  // }, e.target.files).then(res => {
  //   console.log(res)
  // })

  // useGetImageSize(e.target.files[0]).then(res => {
  //   console.log(res)
  // })
}
</script>

<style lang="scss">

</style>