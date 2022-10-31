<template>
  <div class="backstage-account-user">
    <table-page
      :table-data="list"
      @filter="filterData"
      @reset="restFilters"
      :is-index="true"
      :border="true"
      @pageChange="pageChange"
      @select-change="hanleSelectChange"
      :actionWidth="150">
      <template #filter>
        <filter-item :text="'字典名称:'">
          <el-input v-model="list.filters.name" placeholder="请输入字典名称" />
        </filter-item>
      </template>
      <template #action>
        <el-button type="primary" @click="itemOperate(null, 'add')">新增</el-button>
      </template>
      <template #tableAction="{ row }">
        <el-button type="primary" size="small" @click="itemOperate(row, 'edit')">编辑</el-button>
        <el-button type="danger" size="small" @click="itemOperate(row, 'delete')">删除</el-button>
      </template>
    </table-page>
  </div>
  <edit-dialog
    v-if="visible.edit"
    v-model="visible.edit"
    :detail="item.data"
    @submit="listGet"/>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { config } from './config'
import { DictInter, ListInter } from '@/typings/interface'
import { useFilterData, useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import Dict from '@/types/Dict'
import { BasicResponse, PageResponse } from '@/typings/req-res'
import EditDialog from './EditDialog.vue'
import { useFormat } from '@/hooks/date-time'
/**
 * 实例
 */
const ctx = useCtxInstance()
const dict = new Dict()

/**
 * 变量
 */
const list: ListInter<DictInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  config,
  filters: {
    name: ''
  },
  data: []
})
// 当前被操作项
let item = reactive({
  data: null
})
const visible = reactive({
  edit: false
})

/**
 * 逻辑处理
 */
// 获取数据
const listGet = () => {
  dict.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<DictInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.values_str = JSON.stringify(item.values, null, '\t')
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
  })
}
listGet()
// 操作
const itemOperate = (data: any, type) => {
  item.data = data
  if (type !== 'delete') {
    visible.edit = true
  } else {
    useDeleteConfirm().then(() => {
      dict.delete(data.id).then(res => {
        ctx.$message({
          type: 'success',
          duration: 1000,
          message: '删除成功'
        })
        listGet()
      })
    })
  }
}

/**
 * 回调函数
 */
// 筛选数据
const filterData = () => {
  useFilterData(list, listGet)
}
// 切换tab栏
const changeTabs = (type: number) => {
  list.filters.apply_status = type
  listGet()
}
// 分页器数据变化
const pageChange = (data) => {
  list[data.type] = data[data.type]
  listGet()
}
// 表格数据变化
const hanleSelectChange = (data) => {
  console.log(data)
}
// 重置筛选条件
const restFilters = () => {
  for (let key in list.filters) {
    list.filters[key] = typeof list.filters[key] === 'number' ? 0 : ''
  }
  listGet()
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.backstage-account-user {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .tabs-item1 {
    @include flex-layout-align(row, flex-start, center);
    span {
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;
      &:not(.el-tag) {
        padding: 5px 15px 5px 0;
      }
      &.el-tag {
        margin-right: 15px;
      }
      &:first-child {
        font-weight: bold;
      }
    }
  }
}
</style>