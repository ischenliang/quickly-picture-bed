<template>
  <div class="backstage-account-log">
    <table-page
      :table-data="list"
      :is-index="true"
      :selection="true"
      :border="true"
      :actionWidth="150"
      @pageChange="listGet"
      @select-change="hanleSelectChange">
      <template #type="data">
        <!-- {{ types[data.type] }} -->
        <c-status
          :type="types_status[data.type].status"
          :text="types_status[data.type].text"/>
      </template>
      <template #address="data">
        {{ data.client_info ? (data.client_info.province + data.client_info.city) : '-' }}
      </template>
      <template #ip="data">
        {{ data.client_info ? data.client_info.ip : '-' }}
      </template>
      <template #action>
        <el-tooltip
          effect="dark"
          content="删除日志数据将直接影响使用分析里的数据"
          placement="left-start">
          <el-button type="danger" :disabled="selected.length === 0" @click="batchDelete">删除</el-button>
        </el-tooltip>
      </template>
      <template #tableAction="{ row }">
        <el-tooltip
          effect="dark"
          content="删除日志数据将直接影响使用分析里的数据"
          placement="left-start">
          <el-button type="danger" size="small" @click="itemDelete(row)">删除</el-button>
        </el-tooltip>
        <el-button type="primary" size="small" @click="itemLocate(row)">定位</el-button>
      </template>
    </table-page>
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global';
import Log from '@/types/Log';
import { ListInter, LogInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { reactive, ref } from 'vue';
import { config } from './config'
import cStatus from '@/components/web/status/index.vue'



/**
 * 实例
 */
const log = new Log()
const ctx = useCtxInstance()

/**
 * 变量
 */
const list: ListInter<LogInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  config,
  filters: {
    name: ''
  },
  data: []
})
// 已勾选的
const selected = ref([])
// 1: 登录系统 2：上传图片 3：删除图片 4：更新图片
const types_status = reactive({
  1: {
    text: '登录系统',
    status: 'primary'
  },
  2: {
    text: '上传图片',
    status: 'success'
  },
  3: {
    text: '删除图片',
    status: 'danger'
  },
  4: {
    text: '更新图片',
    status: 'warning'
  }
})

/**
 * 数据获取
 */
const listGet = () => {
  log.all({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<LogInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.createdAt = useFormat(item.createdAt)
      return item
    })
  })
}
listGet()


/**
 * 逻辑处理
 */
// 删除
const itemDelete = (data: LogInter) => {
  useDeleteConfirm().then(res => {
    log.delete(data.id).then(res => {
      ctx.$message({
        message: '删除成功',
        duration: 1000,
        type: 'success'
      })
      listGet()
    })
  })
}
// 重新定位
const itemLocate = (data: LogInter) => {
  log.reLocate(data.id).then(res => {
    ctx.$message({
      message: '重新定位成功',
      duration: 1000,
      type: 'success'
    })
    listGet()
  })
}
// 批量删除
const batchDelete = () => {
  const promise = selected.value.map(async item => {
    return await log.delete(item)
  })
  Promise.all(promise).then(res => {
    selected.value = []
    ctx.$message({ message: '删除成功', duration: 1000, type: 'success' })
    listGet()
  })
}
// 表格数据变化
const hanleSelectChange = (data: LogInter[]) => {
  selected.value = data.map(item => item.id)
}
</script>

<style lang="scss">
.backstage-account-log {
  width: 100%;
  height: 100%;
}
</style>