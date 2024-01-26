<template>
  <div class="wiki-conatiner">
    <c-card :title="`知识库(${list.total})`" v-loading="list.loading">
      <template #cardAction>
        <el-input
          v-model="list.filters.search"
          placeholder="请输入搜索内容..."
          style="width: 180px;"
          :suffix-icon="'Search'"
          clearable
          @input="handleInput"/>
      </template>
      <div class="wiki-filter">
        <div></div>
        <div>
          <el-button el-button type="primary" @click="handleUpdate(null)">新增</el-button>
          <el-button v-if="list.data.length" @click="toggleDrag">{{ editable ? '完成排序' : '启用排序' }}</el-button>
        </div>
      </div>
      <div class="wiki-list" v-loading="list.loading">
        <c-empty v-if="list.data.length === 0"></c-empty>
        <el-row id="sortableRef" v-else>
          <el-col
            :xl="6"
            :lg="8"
            :md="12"
            v-for="(item, index) in list.data"
            :key="'wiki-item-' + index"
            class="drag-box-col">
            <wiki-item
              :detail="item"
              :editable="editable"
              @update="handleUpdate(item)"
              @delete="handleDelete(item)"
              @copy="handleCopy(item)"
              @click="handleClick(item)">
            </wiki-item>
          </el-col>
        </el-row>
      </div>
      <div class="wiki-pagination">
        <pagination
          v-model:page="list.page"
          v-model:size="list.size"
          :total="list.total"
          :page-sizes="[18, 36, 72, 100]"
          @change="listGet"/>
      </div>
    </c-card>
    <edit-wiki
      v-if="visible.edit"
      v-model="visible.edit"
      :detail="item.data"
      @submit="listGet"></edit-wiki>
  </div>
</template>
<script lang="ts" setup>
import Wiki from '@/types/Wiki';
import { ListInter, WikiInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { h, nextTick, reactive, ref } from 'vue';
import WikiItem from './wiki-item.vue'
import EditWiki from './EditWiki.vue'
import { useRouter } from 'vue-router';
import CEmpty from '@/components/cEmpty.vue';
import { useCtxInstance, useDeleteConfirm, useDragSort } from '@/hooks/global';
import { ElButton, ElCheckbox, ElInput, ElMessageBox } from 'element-plus';
/**
 * 实例
 */
const wiki = new Wiki()
const router = useRouter()
const ctx = useCtxInstance()

/**
 * 变量
 */
const list: ListInter<WikiInter> = reactive({
  page: 1,
  size: 18,
  total: 0,
  loading: false,
  filters: {
    search: ''
  },
  data: []
})
const visible = reactive({
  edit: false
})
const item: { data: WikiInter } = reactive({
  data: null
})

/**
 * 逻辑处理
 */
function listGet () {
  list.loading = true
  wiki.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<WikiInter>) => {
    list.data = res.items
    list.total = res.total
    list.loading = false
  })
}
listGet()
// 更新
function handleUpdate (wiki: WikiInter) {
  visible.edit = true
  item.data = wiki
}
// 删除
function handleDelete (row: WikiInter) {
  const checked = ref<boolean>(false)
  const isChecked = ref<boolean>(false)
  const value = ref<string>('')
  ElMessageBox({
    title: '提示',
    showCancelButton: false,
    showConfirmButton: true,
    message: () => h('div', null, [
      h('p', null, [
        h('span', null, '你正在删除“'),
        h('b', { style: 'color: red;' }, row.title),
        h('span', null, '”知识库，删除操作无法撤消，并将删除该知识库上的所有内容。')
      ]),
      h('div', null, [
        h(ElCheckbox, {
          modelValue: checked.value,
          'onUpdate:modelValue': (val: boolean) => {
            checked.value = val
          }
        }, '我已知晓，并继续删除本知识库')
      ]),
      checked.value && h('div', { style: 'margin-top: 10px;font-weight: bold;' }, [
        h('p', null, [
          h('span', null, '请输入“'),
          h('span', { style: 'color: red;' }, row.title),
          h('span', null, '”确认删除')
        ]),
        h(ElInput, {
          modelValue: value.value,
          placeholder: '请输入知识库名称',
          style: 'margin-top: 8px;',
          'onUpdate:modelValue': (val: string) => {
            value.value = val
            isChecked.value = value.value === row.title
          }
        }),
        !isChecked.value && value.value && h('p', { style: 'color: red;' }, '请填写正确的名称')
      ])
    ]),
    beforeClose: (action, instance, done) => {
      if (action === 'confirm' && isChecked.value) {
        done()
      }
    }
  }).then(() => {
    wiki.delete(row.id).then(() => {
      ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
      listGet()
    })
  }).catch(() => {})
}
// 复制
function handleCopy (row: WikiInter) {
  ElMessageBox.prompt('请输入新知识库名', '复制知识库', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /(.)+/,
    inputErrorMessage: '请输入知识库名称',
    inputValue: row.title + '(1)'
  }).then(({ value }) => {
    wiki.copy(row.id, value).then(() => {
      ctx.$message({ message: '复制成功', type: 'success', duration: 1000 })
      listGet()
    })
  }).catch(() => {})
}
// 点击
function handleClick (wiki: WikiInter) {
  router.push({
    name: 'WikiArticle',
    params: {
      wid: wiki.id
    }
  })
}


const editable = ref(false)
function toggleDrag () {
  editable.value = !editable.value
  initDrag()
}
function initDrag () {
  nextTick(() => {
    useDragSort(document.querySelector('#sortableRef'), list.data, dragSort)
  })
}
// 切换顺序
function dragSort (fromIndex: number, toIndex: number) {
  list.loading = true
  const [from, to] = [list.data[fromIndex], list.data[toIndex]]
  wiki.sort(from.id, to.id).then(() => {
    listGet()
  })
}
// 搜索
function handleInput (val) {
  setTimeout(() => {
    listGet()
  }, 1000)
}
</script>
<style lang="scss">
@import '@/styles/flex-layout.scss';
.wiki-conatiner {
  width: 100%;
  height: 100%;
  .el-card__header {
    padding: 12px 20px;
  }
  .el-card__body {
    overflow: auto;
    @include flex-layout(column);
    padding: 20px 20px 10px;
  }
  .wiki-list {
    flex: 1;
    .el-row {
      .el-col {
        padding: 5px 10px 15px;
      }
    }
  }
  .wiki-pagination {
    flex-shrink: 0;
  }
  .wiki-filter {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 5px;
    flex-shrink: 0;
    .el-button-group {
      margin-right: 12px;
    }
    .el-select {
      width: 180px;
    }
  }
}
</style>