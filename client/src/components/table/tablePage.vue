<template>
  <div class="table-page">
    <filter-input :enableFilterBtn="enableFilterBtn" @filter="$emit('filter')" @reset="$emit('reset')" v-if="slots.filter">
      <template #content>
        <slot name="filter"></slot>
      </template>
    </filter-input>
    <table-card>
      <template #action>
        <slot name="action"></slot>
      </template>
      <template #tabs>
        <slot name="tabs"></slot>
      </template>
      <table-table
        :data="tableData.data"
        :config="tableData.config"
        :selection="selection"
        :is-index="isIndex"
        :page-num="tableData.page"
        :page-size="tableData.size"
        :width="actionWidth"
        :is-action="isAction"
        :action-align="actionAlign"
        :border="border"
        @select-change="$emit('select-change', $event)">
        
        <!-- 插槽 -->
        <template v-for="(item, index) in tableData.config" #[item.slot]="scope">
          <template v-if="item.slot">
            <slot v-bind="scope" :name="item.slot"></slot>
          </template>
        </template>

        <!-- 操作栏 -->
        <template #opteration="scope" v-if="isAction">
          <slot v-bind="scope" name="tableAction"/>
        </template>
      </table-table>
    </table-card>
    <!-- 分页栏 -->
    <pagination
      v-if="enablePage && tableData.page"
      :key="tableData.page + '-' + tableData.size"
      v-model:page="myData.page"
      v-model:size="myData.size"
      :total="tableData.total"
      @change="pageChange" />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, useSlots } from 'vue'
import tableCard from './tableCard.vue'
import tableTable from './tableTable.vue'
import { ListInter } from '@/typings/interface'
/**
 * 实例
 */
const props = defineProps({
  tableData: {
    type: Object as PropType<ListInter<any>>,
    default: () => {}
  },
  actionAlign: {
    type: String,
    default: 'center'
  },
  actionWidth: {
    type: Number,
    default: 150
  },
  // 开启多选框
  selection: {
    type: Boolean,
    default: false
  },
  // 开启索引
  isIndex: {
    type: Boolean,
    default: false
  },
  // 是否拥有操作栏
  isAction: {
    type: Boolean,
    default: true
  },
  // 是否启用分页栏
  enablePage: {
    type: Boolean,
    default: true
  },
  // 边框
  border: {
    type: Boolean,
    default: false
  },
  // 是否启用查询和重置按钮
  enableFilterBtn: {
    type: Boolean,
    defaul: true
  }
})
const emit = defineEmits(['update:tableData', 'pageChange'])
const slots = useSlots()


const myData = computed({
  get: () => props.tableData,
  set: (val) => {
    emit('update:tableData', val)
  }
})


const pageChange = ($event) => {
  emit('pageChange', $event)
}

</script>

<style lang="scss">
.table-page {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .filter, .pagination {
    flex-shrink: 0;
  }
  .table-card {
    flex: 1 1 auto;
    border-bottom: none !important;
    border-radius: 4px 4px 0 0 !important;
    .el-card__body {
      padding-bottom: 10px !important;
    }
  }
  .pagination {
    background: #fff !important;
    margin-top: 0px !important;
    border: 1px solid #EBEEF5 !important;
    border-top: none !important;
    padding: 0 5px 5px !important;
    border-radius: 0 0 4px 4px !important;
  }
  .filter + .table-card {
    margin-top: 20px;
  }
}
</style>