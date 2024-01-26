<template>
  <div class="wiki-article">
    <!-- 侧边栏 -->
    <article-sidebar
      :tree-data="treeData"
      :article="article"
      :expandedKeys="expandedKeys"
      @update="getArticle"
      @action="handleAction">
    </article-sidebar>
    <!-- 预览区域 -->
    <article-preview
      :article="article"
      v-model:edit="edit"
      :loadig="loading"
      @update="updateArticle"
      @theme-change="handleThemeChange">
    </article-preview>
  </div>
</template>
<script lang="ts" setup>
import Wiki from '@/types/Wiki'
import { ArticleInter } from '@/typings/interface'
import { Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import articlePreview from './article-preview.vue'
import articleSidebar from './article-sidebar.vue'
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { ElMessageBox } from 'element-plus'

/**
 * 实例
 */
const route = useRoute()
const wiki = new Wiki()
const ctx = useCtxInstance()

/**
 * 变量
 */
const { wid } = route.params
const treeData: Ref<ArticleInter[]> = ref([])
const article: Ref<ArticleInter> = ref({
  id: 0,
  title: '',
  theme: {
    code: 'github',
    markdown: 'github'
  }
})
const edit = ref(false)
const loading = ref(false)
const expandedKeys = ref([])

/**
 * 逻辑
 */
// 获取页面目录树
function getPageTree () {
  wiki.getArticlePageTree(+wid).then((res: ArticleInter[]) => {
    treeData.value = res
    if (res.length && !article.value.id) {
      article.value = {
        ...res[0],
        theme: {
          code: 'github',
          markdown: 'github'
        }
      }
      getArticle(res[0])
    }
  })
}
getPageTree()
// 更新节点内容
function getArticle(data: ArticleInter) {
  loading.value = true
  wiki.getArticleDetail(data.id).then((res: ArticleInter) => {
    if (res.markdown === ' ') {
      res.markdown = ''
    }
    article.value = res
    loading.value = false
    expandedKeys.value.push(res.id)
  })
}
// 更新文章
function updateArticle () {
  wiki.updateArticle({
    id: article.value.id,
    title: article.value.title,
    markdown: article.value.markdown
  }).then((res: ArticleInter) => {
    ctx.$message({ message: '文档更新成功', type: 'success', duration: 1000 })
    getPageTree()
  })
}
// 新建文章
function createArticle (type: 'file' | 'folder', title: string = '未命名文档', pid: number = 0) {
  wiki.createArticle({
    title,
    type,
    pid,
    markdown: ''
  }, +wid).then(res => {
    ctx.$message({ message: '文档新建成功', type: 'success', duration: 1000 })
    getPageTree()
  })
}
// 删除文章
function deleteArticle (id: number) {
  wiki.deleteArticle(id).then(res => {
    getPageTree()
    ctx.$message({ message: '文档删除成功', type: 'success', duration: 1000 })
    if (id === article.value.id && treeData.value.length) {
      getArticle(treeData.value[0])
    }
  })
}
// 复制文章
function copyArticle (id: number) {
  wiki.copyArticle(id).then(res => {
    getPageTree()
    ctx.$message({ message: '文档复制成功', type: 'success', duration: 1000 })
  })
}
// 事件触发
function handleAction (action: any) {
  switch (action.func) {
    case 'createFile':
      ElMessageBox.prompt('请输出文档名称', '新建文档', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+$/,
        inputErrorMessage: '请输出文档名称'
      }).then(({ value }) => {
        createArticle('file', value, action.id)
        if (action.id) {
          expandedKeys.value.push(action.id)
        }
      }).catch(() => {})
      break
    case 'createFolder':
      ElMessageBox.prompt('请输出分组名称', '新建分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+$/,
        inputErrorMessage: '请输出分组名称'
      }).then(({ value }) => {
        createArticle('folder', value, action.id)
      }).catch(() => {})
      break
    case 'deleteFile':
      useDeleteConfirm('确定删除吗?该操作会将其子节点一并删除').then(() => {
        deleteArticle(action.id)
      })
      break
    case 'copyFile':
      useDeleteConfirm('该操作只会复制当前节点，其子节点不会复制，确定复制吗？').then(() => {
        copyArticle(action.id)
      })
      break
  }
}
// 主题切换
function handleThemeChange (e) {
  if (e !== article.value.theme.markdown) {
    article.value.theme.code = e
    article.value.theme.markdown = e
    wiki.changTheme(article.value.id, e).then(res => {
      ctx.$message({ message: '主题切换成功', type: 'success', duration: 1000 })
    })
  }
}
</script>
<style lang="scss">
.wiki-article {
  width: 100%;
  height: 100%;
  background: var(--el-bg-color-white);
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
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
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;
        .el-icon, .wiki-icon {
          color: var(--el-text-color-regular);
          margin-right: 8px;
          svg {
            fill: var(--el-text-color-regular);
          }
        }
      }
      &__right {
        .entry-key {
          font-size: 12px;
          color: var(--el-text-color-disabled);
        }
      }
      &:hover {
        background: var(--el-fill-color-light);
      }
    }
  }
}
</style>