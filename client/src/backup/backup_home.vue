<template>
  <div>
    <input type="file" multiple @change="handleChange">
  </div>
</template>

<script lang="ts" setup>
import gitee from '@/hooks/bucket/gitee'
import qiniu from '@/hooks/bucket/qiniu'
import github from '@/hooks/bucket/github'
import leancloud from '@/hooks/bucket/leancloud'
import { useGetImageSize } from '@/hooks/global'


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

  leancloud.uploadFile('6343d452cd84e144d59c9150', e.target.files)
    .then(res => {
      console.log(res)
    })










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