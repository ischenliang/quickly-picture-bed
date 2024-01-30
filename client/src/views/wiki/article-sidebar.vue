<template>
  <div class="wiki-article-sidebar">
    <div class="wiki-article-sidebar__header">
      <!-- 返回到知识库列表 -->
      <div class="wiki-go-back" @click="handleGoBack"><el-icon><DArrowLeft /></el-icon>返回</div>
      <!-- 点击后使用弹窗搜索 -->
      <div class="wiki-search-entry">
        <el-icon class="wiki-search-entry-icon" :size="16"><Search /></el-icon>
        <span class="wiki-search-entry-content">搜索内容</span>
        <span class="wiki-search-entry-hotkey">Ctrl+Shift+F</span>
      </div>
    </div>
    <!-- 文档目录 -->
    <div class="wiki-article-sidebar__content">
      <div class="wiki-page-title">
        <span>文档目录</span>
        <!-- 新建文档、表格、画板、流程图、思维导图、分组、模板创建、批量导入 -->
        <action-popover :actions="actions" :trigger="'click'" @action="$emit('action', $event)">
          <template #reference>
            <div class="action"><el-icon><Plus /></el-icon></div>
          </template>
        </action-popover>
      </div>
      <el-tree
        class="wiki-page-tree"
        ref="treeRef"
        v-loading="loading"
        :data="treeData"
        :props="{
          children: 'children',
          label: 'title'
        }"
        highlight-current
        :default-expanded-keys="expandedKeys"
        node-key="id"
        :current-node-key="article.id"
        :expand-on-click-node="false"
        draggable
        @node-click="handleNodeClick"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop">
        <template #default="{ node, data }">
          <div :class="{
            'node-item': true,
            'active': article.id === data.id
          }">
            <component
              class="node-item-icon"
              :is="getIconComponent(data.type)"
              :size="18"
              :color="getIconColor(data.type)">
            </component>
            <span class="node-item-label">{{ node.label }}</span>
            <div class="node-item-actions" v-if="data.id === article.id">
              <!-- 新建文档、表格、画布、流程图、思维导图、分组、模板创建、批量导入 -->
              <action-popover :actions="addActions" :trigger="'click'" :parent="data" @action="$emit('action', $event)">
                <template #reference>
                  <div class="node-item-action" @click.stop="">
                    <el-icon size="12"><Plus /></el-icon>
                  </div>
                </template>
              </action-popover>
              <!-- 复制、删除、导出(markdown、pdf、word、html)、移动 -->
              <!-- deleteArticle(data) -->
              <action-popover :actions="moreActions" :trigger="'click'" :parent="data" @action="$emit('action', $event)">
                <template #reference>
                  <div class="node-item-action" @click.stop="">
                    <el-icon size="12"><MoreFilled /></el-icon>
                  </div>
                </template>
              </action-popover>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <!-- <div class="wiki-article-sidebar__footer">
      数据统计、设置、回收站、草稿箱
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { ActionItemInter, ArticleInter } from '@/typings/interface';
import { Ref, markRaw, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import IconFolder from './icons/icon-folder.vue'
import IconFile from './icons/icon-file.vue'
import actionPopover from './action-popover.vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type'



/**
 * 实例
 */
const router = useRouter()
const props = withDefaults(defineProps<{
  treeData: ArticleInter[]
  article: ArticleInter
  expandedKeys: number[]
  loading: boolean
}>(), {
  article: () => ({
    id: 0
  } as ArticleInter)
})
const emit = defineEmits(['update', 'action', 'drag-sort'])
const treeRef = ref(null)

/**
 * 变量
 */
const actions: Ref<ActionItemInter[]> = ref([
  { icon: 'file', size: 18, text: '新建文档', func: 'createFile' },
  { icon: 'folder', size: 18, text: '新建分组', func: 'createFolder', color: '#F6C659' },
])
const addActions: Ref<ActionItemInter[]> = ref([
  { icon: 'file', size: 18, text: '新建文档', func: 'createFile' },
  { icon: 'folder', size: 18, text: '新建分组', func: 'createFolder', color: '#F6C659' },
])
const moreActions: Ref<ActionItemInter[]> = ref([
  { icon: 'copy', size: 18, text: '复制文档', func: 'copyFile' },
  { icon: 'delete', size: 18, text: '删除文档', func: 'deleteFile' },
])
  
// 返回
function handleGoBack () {
  router.push({
    name: 'Wiki'
  })
}
// 节点点击
function handleNodeClick (data: ArticleInter) {
  emit('update', data)
}
// 根据类别获取图标组件
function getIconComponent (type: string) {
  let component = null
  switch (type) {
    case 'folder':
      component = markRaw(IconFolder)
      break
    case 'file':
      component = markRaw(IconFile)
      break
    default:
      component = markRaw(IconFile)
      break
  }
  return component
}
// 根据类别获取图标颜色
function getIconColor (type: string) {
  let color = null
  switch (type) {
    case 'folder':
      color = 'rgb(246, 198, 89)'
      break
    case 'file':
      color = 'rgb(156, 156, 251)'
      break
    case 'excel':
      color = '#01a408'
      break
    case 'mindmap':
      color = 'rgb(156, 156, 251)'
      break
    case 'diagram':
      color = 'rgb(156, 156, 251)'
      break
    default: 
      color = 'rgb(156, 156, 251)'
      break
  }
  return color
}
// 拖拽
function handleDragStart (node: Node, ev: DragEvents) {
  // console.log('drag start', node)
}
function handleDragEnter (draggingNode: Node, dropNode: Node, ev: DragEvents) {
  // console.log('tree drag enter:', dropNode.label)
}
function handleDragLeave (draggingNode: Node, dropNode: Node, ev: DragEvents) {
  // console.log('tree drag leave:', dropNode.label)
}
function handleDragOver (draggingNode: Node, dropNode: Node, ev: DragEvents) {
  // console.log('tree drag over:', dropNode.label)
}
function handleDragEnd (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) {
  // console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
function handleDrop (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) {
  console.log('from:', draggingNode.data.title, 'to:', dropNode.data.title, '类型:', dropType)
  emit('drag-sort', {
    from: draggingNode.data.id,
    to: dropNode.data.id,
    type: dropType
  })
}



watch(() => props.article, (val) => {
  if (val) {
    treeRef.value.setCurrentKey(val.id)
  }
}, {
  deep: true,
  immediate: true
})
</script>
<style lang="scss">
.wiki-article-sidebar {
  flex-shrink: 0;
  width: 300px;
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &__header {
    min-height: 48px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    .wiki-search-entry {
      flex: 1;
      height: 32px;
      background: var(--el-fill-color);
      padding: 0 6px 0 12px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--el-text-color-disabled);
      cursor: pointer;
      &-content {
        margin: 0 8px;
        flex: 1;
      }
      &-hotkey {
        flex-shrink: 0;
        padding: 0 4px;
        height: 16px;
        opacity: .4;
        border-radius: 3px;
        background: var(--el-color-info-light-3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 16px;
        color: var(--el-color-white);
      }
      &:hover {
        background: var(--el-fill-color-darker);
      }
    }
    .wiki-go-back {
      margin-right: 5px;
      height: 32px;
      width: 60px;
      background: var(--el-fill-color);
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      color: var(--el-text-color-disabled);
      cursor: pointer;
      .el-icon {
        margin-right: 5px;
      }
      &:hover {
        background: var(--el-fill-color-darker);
      }
    }
  }
  &__content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  &__footer {
    height: 48px;
    border-top: 1px solid var(--el-border-color);
  }
  .wiki-page {
    &-tree {
      flex: 1;
      overflow: auto;
      .el-tree-node__content {
        height: 40px;
        padding: 0 10px;
        .el-icon {
          flex-shrink: 0;
        }
        .node-item {
          flex: 1;
          display: flex;
          align-items: center;
          &-icon {
            margin-right: 5px;
            flex-shrink: 0;
            font-size: 18px;
            &.node-item-icon {
              &__file {
                color: var(--el-text-color-regular);
              }
              &__folder {
                color: var(--el-color-warning);
              }
            }
          }
          &-label {
            flex: 1;
          }
          &-actions {
            display: flex;
          }
          &-action {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            background: var(--el-fill-color-darker);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-left: 6px;
            display: flex;
          }
        }
        // &:hover {
        //   .node-item-action {
        //     display: flex;
        //   }
        // }
      }
      .el-tree-node {
        &.is-current {
          > .el-tree-node__content {
            color: var(--el-color-primary);
            background: var(--el-fill-color-light);
            font-weight: bold;
          }
        }
      }
    }
    &-title {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid var(--el-border-color);
      .action {
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--el-fill-color);
        color: var(--el-text-color-primary);
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid var(--el-border-color);
        cursor: pointer;
      }
      span {
        font-weight: bold;
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>