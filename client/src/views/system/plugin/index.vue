<template>
  <div class="plugin-container">
    <div class="plugin-toolbar">
      <div class="plugin-toolbar-filter">
        <el-input v-model="list.filters.search" placeholder="请输入插件名称" />
        <el-select v-model="list.filters.category" placeholder="请选择插件类别">
          <el-option
            v-for="(item, index) in plugin_types"
            :key="'type-' + index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="listGet">查询</el-button>
        <el-button type="default" @click="resetFilter">重置</el-button>
      </div>
      <div class="plugin-toolbar-action">
        <el-button type="primary" @click="handleAction({ type: 'edit', data: null })">新增</el-button>
        <el-button @click="toggleDrag">{{ draggable ? `完成排序(${list.total})` : `启用排序(${list.total})` }}</el-button>
      </div>
    </div>
    <el-row class="plugin-list" v-loading="list.loading"  id="sortableRef">
      <template v-if="list.data.length">
        <el-col
          v-for="(item, index) in list.data"
          :key="'plugin-item-' + index + '-' + item.id"
          :xl="6"
          :lg="8"
          :md="12" 
          class="drag-box-col">
          <plugin-item
            :detail="item"
            :editable="true"
            :draggable="draggable"
            @click="handleClick(item)"
            @action="handleAction">
          </plugin-item>
        </el-col>
      </template>
      <template v-else>
        <c-empty></c-empty>
      </template>
    </el-row>
  </div>
  <!-- 新增 | 编辑插件 -->
  <edit-plugin
    v-if="visible.edit"
    v-model="visible.edit"
    :detail="item.data"
    @submit="listGet">
  </edit-plugin>
</template>
<script lang="ts" setup>
import Plugin from '@/types/Plugin';
import pluginItem from '@/views/plugin/plugin-item.vue';
import { ListInter, PluginInter } from '@/typings/interface';
import { Ref, computed, nextTick, reactive, ref } from 'vue';
import { PageResponse } from '@/typings/req-res';
import { useRouter } from 'vue-router';
import { useCtxInstance, useDeleteConfirm, useDragSort } from '@/hooks/global';
import editPlugin from './edit-plugin.vue'
import useConfigStore from '@/store/config';
/**
 * 实例
 */
const plugin = new Plugin()
const router = useRouter()
const ctx = useCtxInstance()
const configStore = useConfigStore()
const plugin_types = computed(() => {
  return [
    { label: `全部`, value: '' },
    ...configStore.dicts.find(el => el.code === 'plugin_type').values || []
  ]
})

/**
 * 变量
 */
const list: ListInter<PluginInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  filters: {
    search: '',
    category: ''
  },
  loading: false,
  data: []
})
// 当前被操作项
let item = reactive({
  data: null
})
// 弹窗
const visible = reactive({
  edit: false,
  detail: false
})


/**
 * 逻辑处理
 */
// 获取数据
function listGet () {
  list.loading = true
  plugin.find({
    // page: list.page,
    // size: list.size,
    ...list.filters
  }).then((res: PageResponse<PluginInter>) => {
    list.data = res.items
    list.total = res.total
    list.loading = false
  })
}
listGet()
// 跳转到详情
function handleClick (item: PluginInter) {
  router.push({
    name: 'SystemPluginDetail',
    query: {
      plugin_id: item.id
    }
  })
}
// 操作
function handleAction (e: { type: any; data: PluginInter }) {
  item.data = e.data
  visible[e.type] = true
  switch (e.type) {
    case 'edit':
      break
    case 'switch':
      const { status, id } = e.data
      useDeleteConfirm(`确定要${ status ? '禁用' : '启用' }该存储源插件吗？`).then(() => {
        plugin.toggle(id).then(res => {
          ctx.$message({ type: 'success', duration: 1000, message: `${ status ? '禁用' : '启用' }成功` })
          listGet()
        })
      })
      break
    case 'delete':
      useDeleteConfirm().then(() => {
        plugin.delete(e.data.id).then(res => {
          ctx.$message({ type: 'success', duration: 1000, message: '删除成功' })
          listGet()
        })
      })
      break
  }
}
// 重置筛选
function resetFilter () {
  Object.keys(list.filters).forEach(key => {
    if (typeof list.filters[key] === 'number') {
      list.filters[key] = 0
    } else {
      list.filters[key] = ''
    }
  })
  listGet()
}


const draggable = ref(false)
function toggleDrag () {
  draggable.value = !draggable.value
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
  plugin.sort(from.id, to.id).then(() => {
    listGet()
  })
}
</script>
<style lang="scss">
.plugin-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .plugin-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 10px;
    &-filter {
      display: flex;
      align-items: center;
      > .el-input, > .el-select {
        width: 11.5rem;
      }
      .el-input, .el-select, .el-button {
        &:not(:first-child) {
          margin-left: 15px;
        }
      }
    }
    &-action {
      flex-shrink: 0;
    }
  }
  .el-row {
    &.plugin-list {
      flex: 1;
      background: var(--el-bg-color-white);
    }
    .el-col {
      padding: 10px;
    }
  }
} 
</style>