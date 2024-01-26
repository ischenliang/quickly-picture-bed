<template>
  <div class="wiki-item">
    <drag-box v-if="editable"></drag-box>
    <div class="wiki-item__header">
      <div class="wiki-item-cover" :style="{ background: generateCover(detail.title) }">{{ coverName }}</div>
      <div class="wiki-item-wrapper">
        <div class="wiki-item-title">{{ detail.title }}</div>
        <div class="wiki-item-time">更新于 {{ useFromNow(detail.updatedAt) }}</div>
      </div>
      <div class="wiki-item-status">
        <el-tag v-if="detail.status" effect="dark" type="success" size="small">开放</el-tag>
        <el-tag v-else effect="dark" type="info" size="small">私有</el-tag>
      </div>
    </div>
    <div class="wiki-item__content">
      <div class="wiki-item-desc">{{ detail.description }}</div>
    </div>
    <div class="wiki-item__action">
      <div class="wiki-item-git">
        <!-- 仓库地址 -->
        <a :href="url" target="_blank" @click.stop="">Git仓库</a>
      </div>
      <div class="wiki-item-action" @click.stop="">
        <el-dropdown>
          <div class="wiki-item-action-item"><el-icon><More /></el-icon></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="Edit" @click="handleOperate('update')">编辑</el-dropdown-item>
              <el-dropdown-item icon="Notification" @click="handleOperate('copy')">复制</el-dropdown-item>
              <el-dropdown-item icon="DeleteFilled" @click="handleOperate('delete')">删除</el-dropdown-item>
              <el-dropdown-item icon="Download" @click="handleOperate('download')">导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFromNow } from '@/hooks/date-time';
import { WikiInter } from '@/typings/interface';
import { computed } from 'vue'
import dragBox from '@/components/dragBox.vue';

interface Props {
  detail: WikiInter
  editable?: boolean
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as WikiInter),
  editable: false
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
// 根据名称生成颜色
function generateCover (title: string) {
  // // 将名字转换为 ASCII 码的总和
  // let sum = 0;
  // for (let i = 0; i < title.length; i++) {
  //   sum += title.charCodeAt(i);
  // }
  // // 生成颜色代码
  // const r = Math.floor((sum % 150) + 100).toString(16).padStart(2, '0'); // 红色分量
  // const g = Math.floor(((sum + 100) % 150) + 100).toString(16).padStart(2, '0'); // 绿色分量
  // const b = Math.floor(((sum + 200) % 150) + 100).toString(16).padStart(2, '0'); // 蓝色分量
  // return `#${r}${g}${b}`; // 返回颜色值

  // 将名称转换为哈希值
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  // 通过哈希值计算 RGB 值
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;
  return `rgb(${r}, ${g}, ${b})`;
}
// 取第一个字符
const coverName = computed(() => {
  let title = props.detail.title
  // 使用正则表达式判断是否为中文字符
  if (/^[\u4e00-\u9fa5]+$/.test(title)) {
    let len = title.length;
    // 使用 substring() 方法获取前两个字
    let lastTwo = title.substring(0, 1);
    return lastTwo
  } else {
    return title.charAt(0).toUpperCase()
  }
})
</script>
<style lang="scss">
.wiki-item {
  width: 100%;
  height: 192px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  padding: 16px;
  background: var(--el-bg-color-white);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s;
  &__header {
    display: flex;
    gap: 15px;
    flex-shrink: 0;
  }
  &__content {
    flex: 1;
  }
  &__action {
    margin-top: 10px;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
  }
  &-cover {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-color-white);
    font-weight: bold;
    font-size: 26px;
    text-shadow: 0 0 5px var(--el-color-black);
  }
  &-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  &-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-regular);
    height: 22px;
    overflow: hidden;
    padding-right: 40px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-time {
    font-size: 14px;
    color: var(--el-text-color-placeholder);
  }
  &-desc {
    font-size: 15px;
    margin-top: 10px;
    color: var(--el-text-color-secondary);
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    height: 66px;
  }
  &-status {
    position: absolute;
    top: 16px;
    right: 16px;
  }
  &-git {
    a {
      text-decoration: none;
      color: var(--el-color-primary);
    }
  }
  &-action {
    &-item {
      width: 30px;
      height: 20px;
      background: var(--el-fill-color-dark);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--el-text-color-regular);
      svg {
        fill: var(--el-text-color-regular);
      }
    }
  }
  &:hover {
    transform: translateY(-10px);
  }
}
</style>