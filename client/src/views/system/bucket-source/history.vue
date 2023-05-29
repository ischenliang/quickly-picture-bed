<template>
  <div class="backstage-account-user">
    <table-page
      :table-data="list"
      @filter="filterData"
      @reset="restFilters"
      :is-index="true"
      :border="true"
      :actionWidth="220"
      :selection="true"
      :enable-filter-btn="false"
      @pageChange="listGet"
      @select-change="hanleSelectChange">
      <template #filter>
        <filter-item :text="''">
          <el-button type="default" icon="Back" @click="goBack">返回</el-button>
        </filter-item>
        <filter-item :text="''">
          <div class="history-tips">
            <span class="history-title">
              {{ detail.name }}
              <el-tag type="success" effect="dark">{{ detail.version }}</el-tag>
            </span>
            <span class="history-desc">更新时间: {{ detail.updatedAt }}</span>
          </div>
        </filter-item>
      </template>
      <template #action>
        <el-button type="danger" :disabled="selected.length === 0" @click="batchDelete">删除</el-button>
      </template>
      <template #version="data">
        <el-tag type="success" effect="dark" size="small">{{ data.version }}</el-tag>
      </template>
      <template #version_old="data">
        <el-tag type="info" effect="dark" size="small">{{ data.version_old }}</el-tag>
      </template>
      <template #tableAction="{ row }">
        <el-button type="success" size="small" @click="itemOperate(row, 'detail')">版本对比</el-button>
        <el-button type="primary" size="small" @click="itemOperate(row, 'rollback')">回滚</el-button>
        <el-button type="danger" size="small" @click="itemOperate(row, 'delete')">删除</el-button>
      </template>
    </table-page>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { history_config } from './config'
import { BucketSourceInter, ListInter, BucketSourceHistoryInter } from '@/typings/interface'
import { useFilterData, useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { PageResponse } from '@/typings/req-res'
import BucketSourceHisroty from '@/types/BucketSourceHistory'
import { useFormat } from '@/hooks/date-time'
import { useRoute, useRouter } from 'vue-router'
import BucketSource from '@/types/BucketSource'
/**
 * 实例
 */
const ctx = useCtxInstance()
const bucketSourceHistory = new BucketSourceHisroty()
const bucketSource = new BucketSource()
const router = useRouter()
const route = useRoute()

/**
 * 变量
 */
const list: ListInter<BucketSourceHistoryInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  config: history_config,
  filters: {
    bs_id: route.query.id || ''
  },
  data: []
})
const detail: BucketSourceInter = reactive({
  id: '',
  version: '',
  remark: '',
  name: '',
  updatedAt: ''
})
// 已勾选的
const selected = ref([])

/**
 * 逻辑处理
 */
// 获取详情
const getDetail = () => {
  bucketSource.detail(route.query.id as string).then((res: BucketSourceInter) => {
    detail.id = res.id
    detail.remark = res.remark
    detail.version = res.version
    detail.name = res.name
    detail.updatedAt = useFormat(res.updatedAt)
  })
}
getDetail()
// 获取数据
const listGet = () => {
  bucketSourceHistory.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<BucketSourceInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.config_str = item.config
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
  })
}
listGet()
// 操作
const itemOperate = (data: any, type) => {
  if (type === 'delete') {
    useDeleteConfirm().then(() => {
      bucketSourceHistory.delete(data.id).then(res => {
        ctx.$message({
          type: 'success',
          duration: 1000,
          message: '删除成功'
        })
        listGet()
      })
    })
  }
  if (type === 'detail') {
    router.push({
      name: 'SystemBucketSourceHistoryDetail',
      query: {
        id: data ? data.id : undefined,
        bs_id: route.query.id
      }
    })
  }

  // 版本回退
  if (type === 'rollback') {
    useDeleteConfirm('确定要回滚到当前节点吗？').then(() => {
      bucketSource.rollback(data.id, route.query.id as string).then(res => {
        ctx.$message({ message: '版本回退成功', duration: 1000, type: 'success' })
        listGet()
      })
    })
  }
}
// 返回
const goBack = () => {
  router.go(-1)
}

/**
 * 回调函数
 */
// 筛选数据
const filterData = () => {
  useFilterData(list, listGet)
}
// 重置筛选条件
const restFilters = () => {
  for (let key in list.filters) {
    list.filters[key] = typeof list.filters[key] === 'number' ? 0 : ''
  }
  listGet()
}
// 表格数据变化
const hanleSelectChange = (data: BucketSourceHistoryInter[]) => {
  selected.value = data.map(item => item.id)
}
// 批量删除
const batchDelete = () => {
  useDeleteConfirm().then(() => {
    const promise = selected.value.map(async item => {
      return await bucketSourceHistory.delete(item)
    })
    Promise.all(promise).then(res => {
      selected.value = []
      ctx.$message({ message: '删除成功', duration: 1000, type: 'success' })
      listGet()
    })
  })
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.backstage-account-user {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .history-tips {
    display: flex;
    flex-direction: column;
    .history-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      .el-tag {
        margin-left: 10px;
      }
    }
    .history-desc {
      font-size: 14px;
      color: #555;
    }
  }
}
</style>