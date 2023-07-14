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

    <!-- 上传区域 -->
    <el-card class="custom-card">
      <bucket-upload
        v-model:user-habits="userHabits"
        @success="getTodayLog"></bucket-upload>
    </el-card>

    <!-- 复制和历史记录 -->
    <div class="copy-history">
      <!-- 复制链接 -->
      <el-card>
        <bucket-copy
          v-model:user-habits="userHabits"></bucket-copy>
      </el-card>

      <!-- 上传历史记录 -->
      <el-card>
        <bucket-history :logs="userStore.user_logs"></bucket-history>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BucketSelect from './bucket-select.vue'
import BucketAlbum from './bucket-album.vue'
import BucketCopy from './bucket-copy.vue'
import BucketHistory from './bucket-history.vue'
import BucketUpload from './bucket-upload.vue'
import useUserStore from '@/store/user';
import { computed } from 'vue';
import Log from '@/types/Log';
import { PageResponse } from '@/typings/req-res';
import { LogInter } from '@/typings/interface';
import { useFormat } from '@/hooks/date-time';
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

/**
 * 逻辑处理
 */
const getTodayLog = () => {
  log.today().then((res: PageResponse<LogInter>) => {
    userStore.updateUserLogs(res.items.map(item => {
      item.createdAt = useFormat(item.createdAt)
      return item
    }))
  })
}
getTodayLog()

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
      width: 100%;
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
  }
  .home-tips {
    font-size: 16px;
    color: #fa8c16;
    // margin-bottom: 15px;
    margin-bottom: 10px;
  }
  .el-card {
    margin-bottom: 15px;
    box-shadow: 0px 0px 3px rgb(0 0 0 / 12%);
    border: 0;
  }
  .bucket-select-card {
    .el-card__body {
      padding: 20px 20px 10px;
    }
  }

  .copy-history {
    width: 100%;
    @include flex-layout-align(row, space-between, flex-start);
    .el-card {
      flex: 1;
      height: 230px;
      margin-bottom: 0;
      + .el-card {
        margin-left: 15px;
      }
      .el-card__body {
        @include flex-layout(column);
        height: 100%;
      }
    }
  }
}
</style>