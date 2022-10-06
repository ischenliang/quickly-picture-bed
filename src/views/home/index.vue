<template>
  <div>
    <input type="file" multiple @change="handleChange">
  </div>
</template>

<script lang="ts" setup>
import { useGiteeBucket, useLocalBucket } from '@/hooks/upload';


const handleChange = (e) => {
  // useLocalBucket(e.target.files).then(res => {
  //   console.log('result', res)
  // })


  useGiteeBucket({
    username: 'itchenliang',
    repo: 'img',
    branch: 'master',
    token: '52cdad229e4e56b1a0f9bc7748852ef5',
    path: '/demo',
    customPath: '/img/1',
    commit_messages: 'upload test'
  }, e.target.files).then(res => {
    console.log(res)
  })
}
</script>

<style lang="scss">

</style>