<template>
  <div class="bucket-item">
    <div class="bucket-item-square">
      <span v-if="create" class="trialfont trial-bianji"></span>
      <img v-else :src="detail.user_plugin.plugin.logo" alt="">
    </div>
    <template v-if="create">
      <div class="bucket-item-tip">
        <span class="trialfont trial-bianji"></span>新建存储桶
      </div>
    </template>
    <template v-else>
      <div class="bucket-item-tags">
        <el-tag size="small" type="success">{{ detail.user_plugin.plugin.title }}</el-tag>
        <el-tag size="small" :type="detail.visible ? '' : 'danger'">{{ detail.visible ? '已启用' : '已禁用' }}</el-tag>
      </div>
      <div class="bucket-item-content">
        <div class="bucket-content-title">{{ detail.name }}</div>
        <div class="bucket-content-count">
          <el-tag size="small">版本号: {{ detail.user_plugin.version }}</el-tag>
          <el-tag type="info" size="small">图片数量: 1</el-tag>
          <el-tag type="info" size="small">占用存储: 2MB</el-tag>
        </div>
        <div class="bucket-content-time">
          更新于: {{ detail.updatedAt }}
        </div>
      </div>
      <div class="bucket-item-action">
        <slot name="action"></slot>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { BucketInter } from '@/typings/interface';

interface Props {
  create?: boolean
  detail?: BucketInter
}
withDefaults(defineProps<Props>(), {
  create: false,
  detail: () => ({
    id: 0,
    name: '',
    user_plugin: {
      plugin: {
        logo: ''
      }
    }
  } as BucketInter)
})
</script>
<style lang="scss">
@import '@/styles/flex-layout.scss';
$border: 1px solid #e9ecef;
$border-active: 1px solid #32cfaa;
$text-color: #747a80;
$text-color-active: #32cfaa;
@mixin border($active: false) {
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  @if $active {
    border-color: #32cfaa;
  } @else {
    border-color: #e9ecef;
  }
}
.bucket-item {
  height: 209px;
  @include border;
  position: relative;
  @include flex-layout(column);
  cursor: pointer;
  transition: transform .3s;
  .bucket-item-tip {
    width: 100%;
    height: 100%;
    color: #747a80;
    @include flex-layout-align(row, center, center);
    span {
      margin-right: 5px;
      font-size: 20px;
    }
  }
  .bucket-item-square {
    height: 50px;
    width: 50px;
    line-height: 50px;
    transform: rotate(45deg);
    transition: all 0.5s ease;
    text-align: center;
    @include border;
    top: -25px;
    position: absolute;
    left: 10px;
    background: #fff;
    @include flex-layout-align(row, center, center);
    img {
      width: 30px;
      height: 30px;
      transform: rotate(-45deg);
    }
    span {
      font-size: 30px;
      transform: rotate(-45deg);
      color: #535353;
    }
  }
  .bucket-item-tags {
    position: absolute;
    right: 16px;
    top: 8px;
    text-align: right;
    .el-tag + .el-tag {
      margin-left: 5px;
    }
  }
  .bucket-item-content {
    flex: 1;
    padding: 40px 16px 16px;
    position: relative;
    overflow: hidden;
    .bucket-content-title {
      font-size: 16px;
      // text-align: right;
      font-weight: 600;
      color: #535353;
    }
    .bucket-content-count {
      margin-top: 10px;
      .el-tag {
        margin: 2px 4px 2px 0;
      }
    }
    .bucket-content-time {
      // line-height: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-top: 10px;
      color: rgba(0,0,0,.45);
      .el-tag {
        margin-right: 5px;
        background-color: red !important;
        border-color: red !important;
      }
    }
  }
  .bucket-item-action {
    height: 42px;
    flex-shrink: 0;
    border-top: $border;
    @include flex-layout(row);
    .bucket-action-item {
      flex: 1;
      @include flex-layout-align(row, center, center);
      color: $text-color;
      cursor: pointer;
      + .bucket-action-item {
        border-left: $border;
      }
    }
  }
  &:hover {
    @include border(true);
    transform: translateY(-10px);
    .bucket-item-square {
      @include border(true);
      background: #32cfaa;
      span {
        color: #fff;
      }
    }
    .bucket-item-action {
      border-top: $border-active;
      .bucket-action-item {
        color: $text-color-active;
        + .bucket-action-item {
          border-left: $border-active;
        }
      }
    }
  }
}
</style>