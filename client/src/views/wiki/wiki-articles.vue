<template>
  <div class="wiki-article">
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
      <div class="wiki-article-sidebar__content">
        <div class="wiki-page-title">
          <span>文档目录</span>
          <!-- 新建文档、表格、画板、流程图、思维导图、分组、模板创建、批量导入 -->
          <action-popover :actions="actions">
            <template #reference>
              <div class="action"><el-icon><Plus /></el-icon></div>
            </template>
          </action-popover>
        </div>
        <el-tree
          class="wiki-page-tree"
          :data="treeData"
          :props="{
            children: 'children',
            label: 'title',
          }"
          :expand-on-click-node="false"
          @node-click="handleNodeClick">
          <template #default="{ node, data }">
            <div class="node-item">
              <component
                class="node-item-icon"
                :is="getIconComponent(data.type)"
                :size="18"
                :color="getIconColor(data.type)">
              </component>
              <span class="node-item-label">{{ node.label }}</span>
              <div class="node-item-actions">
                <!-- 新建文档、表格、画布、流程图、思维导图、分组、模板创建、批量导入 -->
                <div class="node-item-action"><el-icon size="12"><Plus /></el-icon></div>
                <!-- 复制、删除、导出(markdown、pdf、word、html)、移动 -->
                <div class="node-item-action"><el-icon size="12"><More /></el-icon></div>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="wiki-article-sidebar__footer">
        数据统计、设置、回收站、草稿箱
      </div>
    </div>
    <div class="wiki-article-preview">
      <div class="wiki-article-preview__header">
        <div class="left-content">
          <div class="wiki-article-title">{{ article.title }}</div>
          <div class="wiki-article-time">更新于 {{ useFromNow(article.updatedAt) }}</div>
        </div>
        <div class="right-content">
          <!-- 编辑、分享、演示、更多(页面信息、导出为、打印、移动、删除) -->
          <div class="wiki-article-action">
            <div class="wiki-article-action-item">
              <icon-edit :size="16"></icon-edit>
              <span>编辑</span>
            </div>
            <div class="wiki-article-action-item">
              <icon-share :size="16"></icon-share>
              <span>分享</span>
            </div>
            <div class="wiki-article-action-item">
              <icon-play :size="16"></icon-play>
              <span>演示</span>
            </div>
            <el-popover placement="bottom" trigger="click" popper-class="wiki-action-menu" width="230">
              <template #reference>
                <div class="wiki-article-action-item">
                  <icon-list :size="16"></icon-list>
                  <span>更多</span>
                </div>
              </template>
              <div class="action-menu">
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-play :size="18"></icon-play>演示模式
                  </div>
                  <div class="action-menu-item__right">
                    <span class="entry-key">Ctrl + Shift + P</span>
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-info :size="18"></icon-info>页面信息
                  </div>
                  <div class="action-menu-item__right">
                    <span class="entry-key">Ctrl + Shift + Q</span>
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-print :size="18"></icon-print>打印页面
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-lock :size="18"></icon-lock>锁定页面
                  </div>
                  <div class="action-menu-item__right">
                    <el-switch v-model="value1" />
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-computer :size="18"></icon-computer>宽屏模式
                  </div>
                  <div class="action-menu-item__right">
                    <el-switch v-model="value1" />
                  </div>
                </div>
                <el-popover placement="left" trigger="hover" popper-class="wiki-action-menu wiki-action-menu-items" width="200">
                  <template #reference>
                    <div class="action-menu-item">
                      <div class="action-menu-item__left">
                        <icon-save :size="18"></icon-save>另存为
                      </div>
                      <div class="action-menu-item__right">&gt;</div>
                    </div>
                  </template>
                  <div class="action-menu">
                    <div class="action-menu-item">
                      <div class="action-menu-item__left">
                        <el-icon :size="18"><Notification /></el-icon>PDF
                      </div>
                    </div>
                    <div class="action-menu-item">
                      <div class="action-menu-item__left">
                        <el-icon :size="18"><Notification /></el-icon>Word
                      </div>
                    </div>
                    <div class="action-menu-item">
                      <div class="action-menu-item__left">
                        <el-icon :size="18"><Notification /></el-icon>Markdown
                      </div>
                    </div>
                    <div class="action-menu-item">
                      <div class="action-menu-item__left">
                        <el-icon :size="18"><Notification /></el-icon>HTML
                      </div>
                    </div>
                  </div>
                </el-popover>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-move :size="18"></icon-move>移动
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <icon-delete :size="18"></icon-delete>删除
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="wiki-article-preview__content">
        <div class="wiki-article-preview-main">
          <!-- <div style="height: 300px;border: 1px solid #efefef;margin-bottom: 10px;" v-for="item in 10" :key="item"></div> -->
          <md-preview :value="article.markdown"></md-preview>
        </div>
        <div class="wiki-article-preview-navigator">导航目录</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Wiki from '@/types/Wiki'
import { ActionItemInter, WikiInter, ArticleInter } from '@/typings/interface'
import { Ref, ref, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconFolder from './icons/icon-folder.vue'
import IconFile from './icons/icon-file.vue'
import IconEdit from './icons/icon-edit.vue'
import IconShare from './icons/icon-share.vue'
import IconPlay from './icons/icon-play.vue'
import IconList from './icons/icon-list.vue'
import IconInfo from './icons/icon-info.vue'
import IconPrint from './icons/icon-print.vue'
import IconLock from './icons/icon-lock.vue'
import IconComputer from './icons/icon-computer.vue'
import IconSave from './icons/icon-save.vue'
import IconMove from './icons/icon-move.vue'
import IconDelete from './icons/icon-delete.vue'
import actionPopover from './action-popover.vue'
import mdPreview from '../plugin/md-preview.vue'
import { useFromNow } from '@/hooks/date-time'
// import { Splitpanes, Pane } from 'splitpanes'
// import 'splitpanes/dist/splitpanes.css'

/**
 * 实例
 */
const route = useRoute()
const router = useRouter()
const wiki = new Wiki()

/**
 * 变量
 */
const treeData: Ref<WikiInter[]> = ref([])
const value1 = ref(false)
const actions: Ref<ActionItemInter[]> = ref([
  { icon: 'file', size: 18, text: '新建文档' },
  { icon: 'excel', size: 18, text: '新建表格' },
  { icon: 'folder', size: 18, text: '新建分组', color: 'rgb(246, 198, 89)' },
  { icon: 'canvas', size: 18, text: '新建画板' },
  { icon: 'diagram', size: 18, text: '新建流程图' },
  { icon: 'mindmap', size: 18, text: '新建思维导图' },
  { icon: 'magic', size: 18, text: '从模板新建' },
  { icon: 'markdown', size: 18, text: '导入文档' }
])
const article: Ref<ArticleInter> = ref({
  id: 0,
  title: ''
})

/**
 * 逻辑
 */
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
// 返回
function handleGoBack () {
  router.push({
    name: 'Wiki'
  })
}
// 节点点击
function handleNodeClick (data: WikiInter) {
  wiki.getArticleDetail(data.id).then((res: ArticleInter) => {
    article.value = res
  })
}
// 获取页面目录树
function getPageTree () {
  wiki.getArticles(+route.query.wid).then((res: WikiInter[]) => {
    treeData.value = res
  })
}
getPageTree()
</script>
<style lang="scss">
.wiki-article {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  &-sidebar {
    flex-shrink: 0;
    width: 300px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &__header {
      min-height: 48px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      .wiki-search-entry {
        flex: 1;
        height: 32px;
        background: #f2f4f6;
        padding: 0 6px 0 12px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.3);
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
          background: #8592a6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          line-height: 16px;
          color: #fff;
        }
        &:hover {
          background: #e6e9ed;
        }
      }
      .wiki-go-back {
        margin-right: 5px;
        height: 32px;
        width: 60px;
        background: #f2f4f6;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        .el-icon {
          margin-right: 5px;
        }
        &:hover {
          background: #e6e9ed;
        }
      }
    }
    &__content {
      flex: 1;
    }
    &__footer {
      height: 48px;
      border-top: 1px solid #eee;
    }
  }
  &-preview {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &__header {
      height: 68px;
      flex-shrink: 0;
      border-bottom: 1px solid rgb(222,224,227);
      display: flex;
      justify-content: space-between;
      padding: 10px;
      flex-shrink: 0;
      .left-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .wiki-article-title {
          font-size: 18px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: #333;
        }
        // .wiki-article-navigator {
        //   font-size: 12px;
        //   color: #838383;
        // }
        .wiki-article-time {
          font-size: 12px;
          color: #909aaa;
        }
      }
      .right-content {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        .wiki-article-action {
          display: flex;
          &-item {
            padding: 5px 7px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #666;
            cursor: pointer;
            .wiki-icon, .el-icon {
              margin-right: 5px;
            }
            &:not(:first-child) {
              margin-left: 5px;
            }
            &:hover {
              background: rgba(102,152,255,.1);
              color: #6698ff;
            }
          }
        }
      }
    }
    &__content {
      flex: 1;
      overflow: auto;
      padding: 15px;
      position: relative;
    }
    &-main {
      margin-right: calc(220px + 17px);
    }
    &-navigator {
      width: 220px;
      border-left: 1px solid #eee;
      position: fixed;
      height: calc(100% - 60px - 68px);
      right: 17px;
      top: calc(60px + 68px);
      z-index: 999;
      background: #fff;
      padding: 10px;
    }
  }
}
.wiki-page {
  &-tree {
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
              color: rgb(156, 156, 251);
            }
            &__folder {
              color: rgb(246, 198, 89);
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
          padding: 3px 4px;
          background: #eaeaea;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          margin-left: 6px;
          display: none;
        }
      }
      &:hover {
        .node-item-action {
          display: flex;
        }
      }
    }
  }
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #efefef;
    .action {
      padding: 3px 4px;
      background: rgba(102,152,255,.1);
      color: #6698ff;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid #f8f9fa;
      color: #333;
      cursor: pointer;
    }
    span {
      font-weight: bold;
      color: #555;
    }
  }
}

.wiki-action-menu {
  transform: translateY(-11px);
  padding: 10px 0px !important;
  &-items {
    transform: translate(11px, 0px);
  }
  .action-menu {
    .action-menu-item {
      padding: 9px 20px;
      line-height: 24px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      &__left {
        color: #333;
        display: flex;
        align-items: center;
        .el-icon, .wiki-icon {
          color: #aaa;
          margin-right: 8px;
        }
      }
      &__right {
        .entry-key {
          font-size: 12px;
          color: #aaa;
        }
      }
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>