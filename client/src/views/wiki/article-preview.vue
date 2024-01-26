<template>
  <div class="wiki-article-preview" v-loading="loading">
    <div class="wiki-article-preview__header">
      <div class="left-content">
        <template v-if="edit">
          <el-input v-model="article.title" />
        </template>
        <template v-else>
          <div class="wiki-article-title">{{ article.title }}</div>
          <div class="wiki-article-time">
            更新于 {{ useFromNow(article.updatedAt) }}
          </div>
        </template>
      </div>
      <div class="right-content">
        <template v-if="edit">
          <el-button type="danger" icon="Back" @click="handleClick('cancel')">取消</el-button>
          <el-button type="success" icon="Checked" @click="handleClick('preview')">保存</el-button>
        </template>
        <template v-else>
          <el-button type="primary" icon="EditPen" @click="handleClick('edit')">编辑</el-button>
        </template>
        <!-- <el-button type="info" @click="visible.theme = true">切换主题</el-button> -->
      </div>
    </div>
    <div class="wiki-article-preview__content" id="bytemd-container">
      <bytemd-editor
        v-if="edit"
        v-model:value="article.markdown"
        :markdown-theme="article.theme.markdown"
        :code-theme="article.theme.code"
        @theme-change="$emit('theme-change', $event)" />
      <bytemd-preview v-else v-model:value="article.markdown" />
    </div>
    <!-- <theme-dialog
      v-if="visible.theme"
      v-model="visible.theme"
      :detail="article"
      @submit="$emit('theme-change', $event)">
    </theme-dialog> -->
  </div>
</template>
<script lang="ts" setup>
import { ArticleInter } from '@/typings/interface';
import { useFromNow } from '@/hooks/date-time'
import bytemdEditor from './bytemd-editor.vue';
import bytemdPreview from './bytemd-preview.vue';
import { nextTick, reactive, watch } from 'vue'
import themes from 'juejin-markdown-themes'
// import themeDialog from './theme-dialog.vue';


/**
 * 实例
 */
const props = withDefaults(defineProps<{
  article: ArticleInter
  edit: boolean
  loading: boolean
}>(), {
  article: () => ({
    title: '',
    updatedAt: '',
    markdown: ''
  } as ArticleInter),
  edit: false,
  loading: false
})
const emit = defineEmits(['update:edit', 'update', 'theme-change'])


/**
 * 变量
 */
const visible = reactive({
  theme: false
})


/**
 * 逻辑处理
 */
// 右上角按钮点击行为
function handleClick (type: 'edit' | 'cancel' | 'preview') {
  switch (type) {
    case 'edit':
      emit('update:edit', true)
      break
    case 'cancel':
      emit('update:edit', false)
      break
    case 'preview':
      emit('update:edit', false)
      emit('update')
      break
  }
}


watch(() => props.article, (val) => {
  nextTick(() => {
    // 方式一：通过切换css文件实现
    // const style = document.querySelector('#bytemd-theme') as HTMLLinkElement
    // style.href = `/juejin-themes/${val.theme.markdown}.css`

    const theme = val.theme.markdown
    const style = document.querySelector('#bytemd-theme') as HTMLLinkElement
    const cssContent = themes[theme]?.style ?? themes.juejin.style
    style.innerHTML = cssContent.replaceAll('.markdown-body', '#bytemd-container .markdown-body')
  })
}, {
  deep: true
})
</script>

<style lang="scss">
.wiki-article-preview {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &__header {
    height: 64px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    justify-content: space-between;
    padding: 10px;
    flex-shrink: 0;
    .left-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 10px;
      .wiki-article-title {
        font-size: 18px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: var(--el-text-color-primary);
        font-weight: 700;
      }
      .wiki-article-time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-top: 5px;
      }
      .el-input {
        height: 100%;
        .el-input__wrapper {
          border: none !important;
          box-shadow: none !important;
        }
        .el-input__wrapper {
          padding: 0 !important;
          font-size: 16px !important;
        }
      }
    }
    .right-content {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
    }
  }
  &__content {
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex;
  }
}
</style>
