<template>
  <div class="container">
    <!-- <div class="my-btn">哈哈哈哈</div> -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
// import key from 'keymaster'
// // 回调函数返回 false 以阻止浏览器默认事件行为
// key('ctrl + p', () => {
//   console.log('绑定成功额')
//   return false
// })
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