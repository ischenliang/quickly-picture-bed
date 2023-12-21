<template>
  <div class="log-container">
    <c-card :title="'操作日志(' + list.total + ')'" v-loading="list.loading">
      <template #cardAction>
        <div class="log-filter">
          <el-select v-model="list.filters.type" placeholder="请选择日志类型" @change="listGet">
            <el-option
              v-for="(item, index) in log_types"
              :key="'type-' + index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </template>
      <div class="log-list">
        <table-table
          :data="list.data"
          :config="list.config"
          :selection="false"
          :is-index="true"
          :page-num="list.page"
          :page-size="list.size"
          :is-action="false"
          :border="true"
          style="height: 100%;">
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
        </table-table>
      </div>
      <div class="log-pagination">
        <pagination
          v-model:page="list.page"
          v-model:size="list.size"
          :total="list.total"
          @change="listGet"/>
      </div>
    </c-card>
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCtxInstance, useDeleteConfirm, useFilterData } from '@/hooks/global';
import Log from '@/types/Log';
import { ListInter, LogInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { computed, reactive, ref } from 'vue';
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
    type: ''
  },
  data: [],
  loading: false
})
// 已勾选的
const selected = ref([])
const log_types = computed(() => {
  return [
    { label: '全部日志', value: '' },
    ...Object.keys(types_status).map(el => {
      return {
        label: types_status[el].text,
        value: el
      }
    })
  ]
})

/**
 * 数据获取
 */
const listGet = () => {
  list.loading = true
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
    list.loading = false
  })
}
listGet()
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.log-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-card__header {
    padding: 12px 20px;
  }
  .el-card__body {
    overflow: hidden;
    @include flex-layout(column);
    padding: 20px 20px 10px;
  }
  
  .log-list {
    flex: 1;
    overflow: hidden;
  }
  .log-pagination {
    flex-shrink: 0;
    margin-top: 10px;
  }
  .log-filter {
    display: flex;
    gap: 15px;
    .el-select {
      width: 180px;
    }
  }
}
</style>