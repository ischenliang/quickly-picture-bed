<template>
  <div>
    12
    <div>
      <button @click="handleClick">点击</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AV from 'leancloud-storage'
import Dict from '@/types/Dict'
/**
 * 实例
 */
const dict = new Dict()


/**
 * 回调函数
 */
const handleClick = () => {
  // const Todo = AV.Object.extend('Todo')
  // const todo = new Todo()
  // todo.set('config', { 
  //   label: '快捷上传',
  //   key: 'upload',
  //   value: 'Command + Shift + P'
  // })
  // todo.save().then(res => {
  //   console.log(res)
  // })


  // dict.create({
  //   name: '性别',
  //   code: 'user_gender',
  //   values: [
  //     { label: '男', value: '男' },
  //     { label: '女', value: '女' },
  //     { label: '保密', value: '保密' }
  //   ]
  // }).then((res) => {
  //   console.log(res)
  // })

  dict.detail('63396f9d31a5a915d521bd2c').then(res => {
    console.log(res)
  })

  // dict.find({
  //   page: 1,
  //   size: 10
  // }).then(res => {
  //   console.log(res)
  // })

}
</script>

<style lang="scss">

</style>