<template>
  <div>
    日志管理|动态管理
    <div style="margin-top: 20px;">此处的动态记录可以使用koa-ts-tools自行编写并存储在数据库中</div>
    <el-button @click="handleClick">点击</el-button>
    <img :src="heart" alt="">
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import heart from '@/assets/01.gif'

const handleClick = () => {
  axios({
    url: 'https://imgs.itchenliang.club/img/202210151453194.png',
    method: 'GET',
    responseType: 'blob'
  }).then(res => {
    // 转成file类型
    // const file = new File([res.data], 'demo.png', { type: 'image/png' });

    // 下载图片
    // saveBlob(res.data, 'demo.png')
  })
}

const saveBlob = (blob, fileName) => {
  const a = document.createElement('a');
  a.style.display = 'none';
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
};
</script>

<style lang="scss">

</style>