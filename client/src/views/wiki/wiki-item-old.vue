<template>
  <div class="wiki-item">
    <div class="wiki-item-title">{{ detail.title }}</div>
    <div class="wiki-item-desc">{{ detail.description || '暂无描述' }}</div>
    <div class="wiki-item-git">
      <a :href="url" target="_blank" @click.stop="">仓库地址</a>
    </div>
    <div class="wiki-item-time">
      <span>创建: {{ useFormat(detail.createdAt, 'YYYY-MM-DD') }}</span>
      <span>编辑: {{ useFormat(detail.updatedAt, 'YYYY-MM-DD') }}</span>
    </div>
    <div class="wiki-item-status">
      <el-tag v-if="detail.status" effect="dark" type="success" size="small">开放</el-tag>
      <el-tag v-else effect="dark" type="info" size="small">私有</el-tag>
    </div>
    <div class="wiki-item-action">
      <el-dropdown>
        <div class="wiki-item-action-item"><el-icon><More /></el-icon></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Edit" @click="handleOperate('update')">编辑</el-dropdown-item>
            <el-dropdown-item icon="DeleteFilled" @click="handleOperate('delete')">删除</el-dropdown-item>
            <el-dropdown-item icon="Notification" @click="handleOperate('copy')">复制</el-dropdown-item>
            <el-dropdown-item icon="Download" @click="handleOperate('download')">导出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { WikiInter } from '@/typings/interface';
import { computed } from 'vue'

interface Props {
  detail: WikiInter
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as WikiInter)
})
const emit = defineEmits(['update', 'delete'])

/**
 * 变量
 */
const url = computed(() => {
  const { type, owner, repo, branch } = props.detail.config
  switch (type) {
    case 'gitee':
      return `https://gitee.com/${owner}/${repo}/tree/${branch}/`
    case 'github':
      return `https://github.com/${owner}/${repo}/tree/${branch}/`
  }
})

// 逻辑
function handleOperate (type) {
  emit(type)
}
</script>
<style lang="scss">
.wiki-item {
  width: 100%;
  height: 192px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  padding: 16px;
  background: #fff;
  position: relative;
  border-top: 5px solid #0db3a6;
  &-title {
    font-size: 17px;
    font-weight: 600;
    color: #535353;
    margin-bottom: 10px;
    height: 22px;
    overflow: hidden;
    padding-right: 40px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-desc {
    font-size: 15px;
    margin-top: 10px;
    // color: #777;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    height: 66px;
  }
  &-git {
    margin-top: 10px;
    a {
      text-decoration: none;
      color: #2d8cf0;
    }
  }
  &-time {
    font-size: 14px;
    margin-top: 10px;
    color: #999;
    span + span {
      margin-left: 8px;
    }
  }
  &-action {
    position: absolute;
    bottom: 11px;
    right: 16px;
    &-item {
      width: 30px;
      height: 20px;
      background: #e3e3e3;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #757575;
    }
  }
  &-status {
    position: absolute;
    top: 16px;
    right: 16px;
  }
}
</style>