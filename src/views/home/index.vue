<template>
  <div class="home-container">
    <div class="home-title">让存储变得简单有效</div>
    <div class="home-tips">
      <span>图片最大支持 10.00 MB</span>
      <span>最多支持同时上传 10 张</span>  
    </div>
    <!-- 选择存储桶 -->
    <el-card>
      <div class="bucket-title">选择存储桶</div>
      <div class="bucket-list">
        <el-tag size="large" type="info" effect="dark">七牛云</el-tag>
        <el-tag size="large" type="info">码云</el-tag>
        <el-tag size="large" type="info">Github</el-tag>
        <el-tag size="large" type="info">本地存储桶</el-tag>
        <el-tag size="large" type="info">leancloud</el-tag>
      </div>
    </el-card>

    <!-- 上传区域 -->
    <el-card>
      <div class="upload"></div>
      <div class="quick-entry">
        <div class="entry-title">快捷上传</div>
        <div class="entry-list">
          <el-button type="primary" round>剪切板图片</el-button>
          <el-button type="primary" round>网络图URL</el-button>
        </div>
      </div>
    </el-card>

    <!-- 复制和历史记录 -->
    <div class="copy-history">
      <el-card>
        <div class="bucket-title">链接格式</div>
        <el-tabs v-model="activeTab" class="demo-tabs" type="border-card">
          <el-tab-pane label="URL" name="URL">URL</el-tab-pane>
          <el-tab-pane label="HTML" name="HTML">HTML</el-tab-pane>
          <el-tab-pane label="CSS" name="CSS">CSS</el-tab-pane>
          <el-tab-pane label="Markdown" name="Markdown">Markdown</el-tab-pane>
          <el-tab-pane label="BBCode" name="BBCode">BBCode</el-tab-pane>
          <el-tab-pane label="UBB" name="UBB">UBB</el-tab-pane>
        </el-tabs>
      </el-card>
      <el-card>
        <div class="bucket-title">上传记录</div>
        <div class="bucket-list">
          <el-tag size="large" type="info" effect="dark">七牛云</el-tag>
          <el-tag size="large" type="info">码云</el-tag>
          <el-tag size="large" type="info">Github</el-tag>
          <el-tag size="large" type="info">本地存储桶</el-tag>
          <el-tag size="large" type="info">leancloud</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue-demi";


const activeTab = ref('URL')
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
$color: #6c757d;
$color-active: #ffffff;
.home-container {
  width: 100%;
  min-height: 100%;
  @include flex-layout(column);
  // background: #fff;
  padding: 10px 10px 0;
  .home-title {
    font-size: 32px;
    margin-bottom: 15px;
  }
  .home-tips {
    font-size: 16px;
    color: #212529;
    margin-bottom: 15px;
  }
  .el-card {
    // border: 1px solid rgba(0,0,0,.125);
    margin-bottom: 15px;
    box-shadow: 0px 0px 3px rgb(0 0 0 / 12%);
    border: 0;
    // background: transparent;
    .bucket-title {
      font-size: 18px;
      margin-bottom: 15px;
    }
    .bucket-list {
      margin-left: -5px;
      .el-tag {
        height: 38px !important;
        padding: 0 15px;
        font-size: 16px;
        background: transparent;
        border: 1px solid $color;
        color: $color;
        margin-bottom: 8px;
        margin-left: 8px;
        cursor: pointer;
        &.el-tag--dark {
          background: $color;
          color: $color-active;
        }
      }
    }
    .upload {
      height: 280px;
      border: 1px dashed #dcdee2;
      border-radius: 4px;
    }
    .quick-entry {
      margin-top: 15px;
      @include flex-layout-align(column, center, center);
      .entry-title {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }

  .copy-history {
    width: 100%;
    @include flex-layout-align(row, space-between, flex-start);
    .el-card {
      flex: 1;
      height: 160px;
      + .el-card {
        margin-left: 15px;
      }
    }
  }

  .el-tabs {
    .el-tabs__header {
      background: #fff;
    }
    .el-tabs__item {
      margin-left: -1px;
      border-right: 1px solid #dcdfe6;
      &.is-active {
        font-weight: bold;
      }
    }
  }
}
</style>