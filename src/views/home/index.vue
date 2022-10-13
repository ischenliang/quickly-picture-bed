<template>
  <div class="home-container">
    <div class="home-title">让存储变得简单有效</div>
    <div class="home-tips">严禁上传包含反动、暴力、色情、违法、及侵权内容的文件。</div>
    <!-- 选择存储桶 -->
    <el-card>
      <bucket-select v-model:user-habits="userHabits"></bucket-select>
    </el-card>

    <!-- 上传区域 -->
    <el-card class="custom-card">
      <bucket-upload v-model:user-habits="userHabits"></bucket-upload>
    </el-card>

    <!-- 复制和历史记录 -->
    <div class="copy-history">
      <!-- 复制链接 -->
      <el-card>
        <bucket-copy v-model:user-habits="userHabits"></bucket-copy>
      </el-card>

      <!-- 上传历史记录 -->
      <el-card>
        <bucket-history></bucket-history>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BucketSelect from './bucket-select.vue'
import BucketCopy from './bucket-copy.vue'
import BucketHistory from './bucket-history.vue'
import BucketUpload from './bucket-upload.vue'
import useUserStore from '@/store/user';
import { computed } from 'vue';
/**
 * 实例
 */
const userStore = useUserStore()

/**
 * 变量
 */
const userHabits = computed(() => {
  return userStore.user_habits
})

/**
 * 逻辑处理
 */
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.home-container {
  width: 100%;
  min-height: 100%;
  @include flex-layout(column);
  padding: 0 10px 0;
  .home-title {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .home-tips {
    font-size: 16px;
    color: #fa8c16;
    margin-bottom: 15px;
  }
  .el-card {
    margin-bottom: 15px;
    box-shadow: 0px 0px 3px rgb(0 0 0 / 12%);
    border: 0;
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