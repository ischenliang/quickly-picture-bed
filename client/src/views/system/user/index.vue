<template>
  <div class="backstage-account-user">
    <table-page
      :table-data="list"
      @filter="filterData"
      @reset="restFilters"
      :is-index="true"
      :border="true"
      @pageChange="listGet"
      @select-change="hanleSelectChange"
      :actionWidth="260">
      <template #filter>
        <filter-item :text="'用户名称:'">
          <el-input v-model="list.filters.username" placeholder="请输入用户名称" />
        </filter-item>
        <filter-item :text="'手机号码:'">
          <el-input v-model="list.filters.phone" placeholder="请输入手机号码" />
        </filter-item>
        <filter-item :text="'角色:'">
          <el-select v-model="list.filters.role">
            <el-option label="全部" :value="''"/>
            <el-option
              v-for="(value, key) in roles"
              :key="key"
              :label="value"
              :value="parseInt(key)" />
          </el-select>
        </filter-item>
      </template>
      <template #action>
        <el-button type="primary" @click="itemOperate(null, 'edit')">新增</el-button>
      </template>
      <template #tableAction="{ row }">
        <el-button type="primary" size="small" @click="itemOperate(row, 'edit')">编辑</el-button>
        <el-button type="success" size="small" @click="itemOperate(row, 'detail')">查看</el-button>
        <el-button
          :type="row.status ? 'warning' : 'info'"
          size="small"
          @click="itemOperate(row, 'disable')">
          {{ row.status ? '禁用' : '启用' }}
        </el-button>
        <el-button type="danger" size="small" @click="itemOperate(row, 'delete')">删除</el-button>
      </template>
    </table-page>
  </div>
  <edit-dialog
    v-if="visible.edit"
    v-model="visible.edit"
    :detail="item.data"
    @submit="listGet"/>
  <detail-dialog
    v-if="visible.detail"
    v-model="visible.detail"
    :detail="item.data"/>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { config } from './config'
import { DictInter, ListInter, UserInter } from '@/typings/interface'
import { useFilterData, useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { BasicResponse, JsonResponse, PageResponse } from '@/typings/req-res'
import EditDialog from './EditDialog.vue'
import DetailDialog from './detailDialog.vue'
import Users from '@/types/User'
import Dict from '@/types/Dict'
import { useFormat } from '@/hooks/date-time'
/**
 * 实例
 */
const ctx = useCtxInstance()
const user = new Users()
const dict = new Dict()

/**
 * 变量
 */
const list: ListInter<UserInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  config,
  filters: {
    username: '',
    phone: '',
    role: ''
  },
  data: []
})
// 当前被操作项
let item = reactive({
  data: null
})
const visible = reactive({
  edit: false,
  detail: false
})
// 角色
const roles = reactive({})

/**
 * 逻辑处理
 */
const getRoleDict = () => {
  dict.detailByPro('code', 'user_role').then((res: DictInter) => {
    res.values.forEach(item => {
      roles[item.value as string] = item.label
    })
    listGet()
  })
}
getRoleDict()
// 获取数据
const listGet = () => {
  user.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<UserInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.role_name = roles[item.role]
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
  })
}
// 操作
const itemOperate = (data: UserInter, type) => {
  item.data = data
  visible[type] = true
  if (type === 'delete') {
    useDeleteConfirm('删除用户将会把用户关联数据一并删除，确定要删除吗').then(res => {
      user.delete(data.id).then(res => {
        ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
        listGet()
      })
    })
  }
  if (type === 'disable') {
    user.toggleStatus(data.id).then(res => {
      ctx.$message({ message: '操作成功', type: 'success', duration: 1000 })
      listGet()
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
// 表格数据变化
const hanleSelectChange = (data) => {
  console.log(data)
}
// 重置筛选条件
const restFilters = () => {
  for (let key in list.filters) {
    if (typeof list.filters[key] === 'number' && !['role'].includes(key)) {
      list.filters[key] = 0
    } else {
      list.filters[key] = ''
    }
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