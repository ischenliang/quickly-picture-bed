<template>
  <div class="home-container">
    <div class="home-title">
      <span>让存储变得简单有效</span>
      <span></span>
      <el-button type="success" v-if="route.query.from" @click="() => $router.back()">返回列表</el-button>
      <el-button type="success" @click="handleClick" v-if="route.query.album_id && !route.query.from">返回相册</el-button>
      <el-button type="success" @click="handleClick" v-if="!route.query.album_id && route.query.img_id">返回图库</el-button>
    </div>
    <div class="home-tips">严禁上传包含反动、暴力、色情、违法、及侵权内容的文件。</div>
    <!-- 选择存储桶 -->
    <el-card class="bucket-select-card">
      <bucket-select v-model:user-habits="userHabits"></bucket-select>
    </el-card>

    <!-- 选择相册 -->
    <!-- <el-card class="bucket-select-card">
      <bucket-album v-model:user-habits="userHabits"></bucket-album>
    </el-card> -->

    <!-- 复制和历史记录 -->
    <div class="copy-history">
      <!-- 上传区域 -->
      <el-card class="custom-card upload-card">
        <bucket-upload v-model:user-habits="userHabits"></bucket-upload>
      </el-card>

      <!-- 复制链接 -->
      <el-card class="drag-card">
        <bucket-drag v-model:user-habits="userHabits"></bucket-drag>
      </el-card>
    </div>
    
    <!-- 复制链接 -->
    <el-card class="copy-card" style="margin-top: 15px;">
      <bucket-copy v-model:user-habits="userHabits"></bucket-copy>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import BucketSelect from './bucket-select.vue'
import BucketCopy from './bucket-copy.vue'
import BucketDrag from './image-drag.vue'
import BucketUpload from './bucket-upload.vue'
import useUserStore from '@/store/user';
import { computed } from 'vue';
import Log from '@/types/Log';
import { useRoute, useRouter } from 'vue-router';
/**
 * 实例
 */
const userStore = useUserStore()
const log = new Log()
const router = useRouter()
const route = useRoute()


/**
 * 变量
 */
const userHabits = computed(() => {
  return userStore.user_habits.data
})

// 返回
const handleClick = () => {
  router.back()
}
</script>

<style lang="scss">
@media screen and (max-width: 1200px) {
  .copy-history {
    flex-direction: column !important;
    .el-card {
      width: 100% !important;
      + .el-card {
        margin: 15px 0 0 0 !important;
      }
    }
  }
}
@import '@/styles/flex-layout.scss';
.home-container {
  width: 100%;
  min-height: 100%;
  @include flex-layout(column);
  padding: 0px;
  .home-title {
    font-size: 28px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // color: #0db3a6;
  }
  .home-tips {
    font-size: 16px;
    // color: #0db3a6;
    color: #ff4a83;
    // margin-bottom: 15px;
    margin-bottom: 10px;
  }
  .el-card {
    margin-bottom: 15px;
    box-shadow: 0px 0px 3px rgb(0 0 0 / 12%);
    border: 0;
    .el-card__body {
      padding: 15px 15px 10px;
      position: relative;
    }
  }

  .copy-history {
    width: 100%;
    @include flex-layout-align(row, space-between, flex-start);
    .el-card {
      height: 365px;
      margin-bottom: 0;
      + .el-card {
        margin-left: 15px;
      }
      .el-card__body {
        @include flex-layout(column);
        height: 100%;
      }
    }
    .drag-card {
      width: 35%;
      flex-shrink: 0;
    }
    .upload-card {
      flex: 1;
    }
  }
}
</style>