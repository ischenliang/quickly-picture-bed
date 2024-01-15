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
      <drag-box v-if="editable"></drag-box>
      <div class="bucket-item-tags">
        <el-tag size="small" type="success">{{ detail.user_plugin.plugin.title }}</el-tag>
        <el-tag size="small" :type="detail.visible ? '' : 'danger'">{{ detail.visible ? '已启用' : '已禁用' }}</el-tag>
      </div>
      <div class="bucket-item-content">
        <div class="bucket-content-title">
          <el-tag size="small" effect="dark" type="success">{{ detail.user_plugin.version }}</el-tag>
          {{ detail.name }}
        </div>
        <div class="bucket-content-count">
          <!-- <el-tag size="small">版本号: {{ detail.user_plugin.version }}</el-tag> -->
          <el-tag type="info" size="small">图片数量: {{ stats.bucket_count }}</el-tag>
          <el-tag type="info" size="small">占用存储: {{ stats.bucket_storage }}MB</el-tag>
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
import { BucketInter, BucketStatsInter } from '@/typings/interface';
import dragBox from '@/components/dragBox.vue';

interface Props {
  create?: boolean
  detail?: BucketInter
  editable?: boolean
  stats?: BucketStatsInter
}
withDefaults(defineProps<Props>(), {
  create: false,
  editable: false,
  detail: () => ({
    id: 0,
    name: '',
    user_plugin: {
      plugin: {
        logo: ''
      }
    },
    stats: {}
  } as BucketInter)
})
</script>
<style lang="scss">
@import '@/styles/flex-layout.scss';
$border: 1px solid #e9ecef;
$border-active: 1px solid var(--el-color-primary);
$text-color: var(--el-text-color-secondary);
$text-color-active: var(--el-color-primary);
@mixin border($active: false) {
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  @if $active {
    border-color: $text-color-active;
  } @else {
    border-color: var(--el-border-color-lighter);
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
    color: var(--el-text-color-regular);
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
    background: var(--el-color-white);
    @include flex-layout-align(row, center, center);
    img {
      width: 30px;
      height: 30px;
      transform: rotate(-45deg);
      border-radius: 4px;
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
      font-weight: 600;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .el-tag {
        margin-right: 2px;
        height: 18px !important;
        padding: 1px 3px;
        background: var(--el-color-success);
        border-color: var(--el-color-success);
      }
    }
    .bucket-content-count {
      margin-top: 10px;
      .el-tag {
        margin: 2px 4px 2px 0;
      }
    }
    .bucket-content-time {
      height: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-top: 10px;
      color: var(--el-text-color-secondary);
      .el-tag {
        margin-right: 5px;
        background-color: var(--el-color-danger) !important;
        border-color: var(--el-color-danger) !important;
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
      background: var(--el-color-success);
      span {
        color: var(--el-color-white);
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