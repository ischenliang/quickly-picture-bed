<template>
  <div>
    <div>123</div>
    <div>{{ msg }}</div>
    <button @click="handleClick">点击</button>
    <about></about>
    <demo></demo>
    <router-link :to="'/'">首页</router-link>
    <router-link :to="'/test/1'">测试</router-link>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { BucketSource } from '@/types/BucketSource';
import { BasicResponse } from '@/typings/res';
import { BucketSourceInter, ListInter } from '@/typings/interface';
import About from '@/views/about.vue'
import Demo from '@/views/demo.vue'
const msg =  ref('Hello Vue3.x')

const list: ListInter<BucketSourceInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  data: []
})

const bucketSource = new BucketSource()
const handleClick = () => {
  /**
   * 测试代码一：会创建Todo数据结构，并且新建一条数据
   */
  // let tmp: BucketSourceInter = {
  //   name: '七牛云 KODO',
  //   type: BucketSourceEnum.Qiniu,
  //   config: [
  //     { label: '空间名称', value: 'bucket', type: 'string', required: true }
  //   ]
  // }
  // bucketSource.create(tmp).then((res: { id: number }) => {
  //   console.log(res.id)
  // })

  bucketSource.find({
    page: 1,
    size: 10
  }).then((res: BasicResponse<BucketSourceInter>) => {
    list.total = res.total
    list.data = res.data
  })
}

</script>

<style>

</style>