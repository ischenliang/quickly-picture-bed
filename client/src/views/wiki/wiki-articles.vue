<template>
  <div class="wiki-article">
    <div class="wiki-article-sidebar">
      <div class="wiki-article-sidebar__header">
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
          <!-- 新建文档、表格、画布、流程图、思维导图、分组、模板创建、批量导入 -->
          <div class="action"><el-icon><Plus /></el-icon></div>
        </div>
        <el-tree
          class="wiki-page-tree"
          :data="data"
          :props="{
            children: 'children',
            label: 'label',
          }"
          @node-click="handleNodeClick">
          <template #default="{ node, data }">
            <div class="node-item">
              <el-icon><Folder /></el-icon>
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
          <div class="wiki-article-title">Nesjs文档笔记</div>
          <div class="wiki-article-time">上次修改于 2023-09-04 14:10:41</div>
        </div>
        <div class="right-content">
          <!-- 编辑、分享、演示、更多(页面信息、导出为、打印、移动、删除) -->
          <div class="wiki-article-action">
            <div class="wiki-article-action-item">
              <el-icon :size="16"><Edit /></el-icon>
              <span>编辑</span>
            </div>
            <div class="wiki-article-action-item">
              <el-icon :size="16"><Share /></el-icon>
              <span>分享</span>
            </div>
            <div class="wiki-article-action-item">
              <el-icon :size="16"><DataAnalysis /></el-icon>
              <span>演示</span>
            </div>
            <el-popover placement="bottom" trigger="click" popper-class="wiki-action-menu" width="230">
              <template #reference>
                <div class="wiki-article-action-item">
                  <el-icon :size="16"><Operation /></el-icon>
                  <span>更多</span>
                </div>
              </template>
              <div class="action-menu">
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <el-icon :size="18"><Notification /></el-icon>
                    演示模式
                  </div>
                  <div class="action-menu-item__right">
                    <span class="entry-key">Ctrl + Shift + P</span>
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <el-icon :size="18"><Notification /></el-icon>页面信息
                  </div>
                  <div class="action-menu-item__right">
                    <span class="entry-key">Ctrl + Shift + Q</span>
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <el-icon :size="18"><Notification /></el-icon>打印页面
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <el-icon :size="18"><Notification /></el-icon>锁定页面
                  </div>
                  <div class="action-menu-item__right">
                    <el-switch v-model="value1" />
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <el-icon :size="18"><Notification /></el-icon>宽屏模式
                  </div>
                  <div class="action-menu-item__right">
                    <el-switch v-model="value1" />
                  </div>
                </div>
                <el-popover placement="left" trigger="hover" popper-class="wiki-action-menu wiki-action-menu-items" width="200">
                  <template #reference>
                    <div class="action-menu-item">
                      <div class="action-menu-item__left">
                        <el-icon :size="18"><Notification /></el-icon>
                        另存为
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
                    <el-icon :size="18"><Delete /></el-icon>移动
                  </div>
                </div>
                <div class="action-menu-item">
                  <div class="action-menu-item__left">
                    <el-icon :size="18"><Delete /></el-icon>删除
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="wiki-article-preview__content"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'


// import { Splitpanes, Pane } from 'splitpanes'
// import 'splitpanes/dist/splitpanes.css'

interface Tree {
  label: string
  children?: Tree[]
}

/**
 * 变量
 */
const data: Tree[] = [
  {
    label: '价格问题',
    children: [
      { label: '价格问题1-1' },
      { label: '价格问题1-2' },
    ],
  },
  {
    label: '编辑问题',
    children: [
      { label: '编辑问题1-1' },
      { label: '编辑问题1-2' },
    ],
  }
]
const value1 = ref(false)

/**
 * 逻辑
 */
function handleNodeClick (data: Tree) {
  console.log(data)
}
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
      padding: 0 16px;
      .wiki-search-entry {
        width: 100%;
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
            span {
              margin-left: 5px;
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
  }
}
// .splitpanes.default-theme {
//   .splitpanes__pane {
//     background: transparent !important;
//   }
//   .splitpanes__splitter {
//     width: 1px;
//     border-left: 1px solid #dcdee2;
//     &::before {
//       display: none;
//     }
//     &::after {
//       display: none;
//     }
//   }
// }
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
        > .el-icon {
          margin-right: 5px;
          flex-shrink: 0;
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
        .el-icon {
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