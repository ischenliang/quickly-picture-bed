<template>
  <div class="backstage-account-log">
    <table-page
      :table-data="list"
      :is-index="true"
      :selection="true"
      :border="true"
      :actionWidth="100"
      :is-action="false"
      @pageChange="listGet"
      @select-change="hanleSelectChange">
      <template #type="data">
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
        <!-- <el-tooltip
          effect="dark"
          content="删除日志数据将直接影响使用分析里的数据"
          placement="left-start">
          <el-button type="danger" :disabled="selected.length === 0" @click="batchDelete">删除</el-button>
        </el-tooltip> -->
      </template>
      <!-- 禁止用户删除日志 -->
      <!-- <template #tableAction="{ row }">
        <el-tooltip
          effect="dark"
          content="删除日志数据将直接影响使用分析里的数据"
          placement="left-start">
          <el-button type="danger" size="small" @click="itemDelete(row)">删除</el-button>
        </el-tooltip>
      </template> -->
    </table-page>
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCtxInstance, useDeleteConfirm, useFilterData } from '@/hooks/global';
import Log from '@/types/Log';
import { ListInter, LogInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { reactive, ref } from 'vue';
import { config } from './config'
import cStatus from '@/components/web/status/index.vue'
import types_status from '@/hooks/useLogType';



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

/**
 * 数据获取
 */
const listGet = () => {
  log.find({
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