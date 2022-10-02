<template>
  <div>
    <span>测试路由</span>
    <div>
      <button @click="handleClick">点击</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { Image } from '@/types/Image'
import { Bucket } from '@/types/Bucket'
import AV from 'leancloud-storage'

/**
 * 实例
 */
const route = useRoute()
const image = new Image()
const bucket = new Bucket()


const handleClick = async () => {
  // const bucketQuery = new AV.Query('Bucket')
  // bucketQuery.equalTo('objectId', '6339464631a5a915d5217029')
  // image.create({
  //   img_name: '01.png',
  //   img_width: 60,
  //   img_height: 30,
  //   mine_type: 'png',
  //   img_url: '/01.png',
  //   img_size: 20,
  //   bucket_id: await bucketQuery.first(),
  //   bucket_type: 'qiniu'
  // }).then(res => {
  //   console.log(res)
  // })

  // bucket.create({
  //   type: 'qiniu',
  //   tag: '七牛云 KODO',
  //   name: '七牛图床',
  //   config: '121212',
  //   visible: true,
  // })

  // bucket.delete('6339464631a5a915d5217029').then(res => {
  //   console.log(res)
  // })

  // log.find({
  //   uid: '633934a4cd84e144d58d87c5'
  // }).then(res => {
  //   console.log(res)
  // })


}
</script>

<style lang="scss">

</style>