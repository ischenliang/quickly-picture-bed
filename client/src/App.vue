<template>
  <div class="container">
    <!-- <div class="my-btn">哈哈哈哈</div> -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import key from 'keymaster'

import { nextTick, watch } from 'vue';
import useUserStore from './store/user';

/**
 * 实例
 */
const userStore = useUserStore()


/**
 * 监听器
 */
watch(() => userStore.user_habits, (val) => {
  const shortKey = val.data.shortKey
  nextTick(() => {
    // // 回调函数返回 false 以阻止浏览器默认事件行为
    // key('control + a', () => {
    //   console.log('绑定成功额')
    //   return false
    // })
    
    shortKey.forEach(item => {
      console.log(item.value.toLowerCase())
      key(item.value.toLowerCase(), () => {
        console.log('绑定成功额')
        return false
      })
    })
  })
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="scss">
// @import 'reset.css';
@import '@/styles/font.scss';
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
  padding: 0;
  margin: 0;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: $bgcolor-main;
  // padding: 10px;
}
</style>