<template>
  <div class="table-table">
    <el-table
      v-loading="isLoading"
      :data="data"
      :header-cell-style="{color:'#333',fontSize:'14px'}"
      :row-style="{fontSize:'14px',color:'#666'}"
      size="medium"
      :border="border"
      element-loading-text="Loading"
      style="width: 100%"
      height="100%"
      @selection-change="$emit('select-change', $event)">
      <!-- 多选操作 -->
      <el-table-column v-if="selection" type="selection" width="55" align="center" />
      <!-- 显示序号 -->
      <el-table-column v-if="isIndex" type="index" label="序号" width="80" align="center">
        <template v-slot="{ $index }">
          {{ getIndex($index) }}
        </template>
      </el-table-column>
      <!-- 其他传入的项 -->
      <el-table-column v-for="(item,index) in config" :key="index" :align="item.align ? item.align : 'center'" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <!-- 循环绑定插槽 -->
          <template v-if="item.slot">
            <slot v-bind="scope.row" :name="item.slot"></slot>
          </template>
          <!-- 普通框 -->
          <span v-else class="text">
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="isAction" :width="width" :align="actionAlign" label="操作">
        <template v-slot="scope">
          <slot :row="scope.row" name="opteration" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { TableColumnConfig } from '@/typings/interface'
/**
 * 实例
 */
const props = defineProps({
  // 数据
  data: {
    type: Array,
    default: () => []
  },
  // 操作栏对齐方式
  actionAlign: {
    type: String,
    default: 'center'
  },
  // props定义
  config: {
    type: Array<TableColumnConfig>,
    default: () => []
  },
  // 是否loading...
  isLoading: {
    type: Boolean,
    default: false
  },
  // 是否有操作
  isAction: {
    type: Boolean,
    default: true
  },
  // 操作列宽度
  width: {
    type: Number,
    default: 150
  },
  // 是否开启复选框
  selection: {
    type: Boolean,
    default: false
  },
  // 是否开启序号
  isIndex: {
    type: Boolean,
    default: false
  },
  // 页码
  pageNum: {
    type: Number,
    default: 1
  },
  // 每页显示多少条数据
  pageSize: {
    type: Number,
    default: 10
  },
  // 边框
  border: {
    type: Boolean,
    default: false
  }
})

/**
 * 逻辑处理函数
 */
const getIndex = (index) => {
  return (props.pageNum - 1) * props.pageSize + (index + 1)
}

/**
 * 回调函数
 */

</script>

<style lang="scss">
.table-table {
  width: 100%;
  height: 100%;
  .el-table {
    thead {
      color: black;
      font-weight: bold;
    }
    .cell {
      word-break: normal;
    }
    .el-button.is-text + .el-button.is-text {
      margin-left: 0;
    }
  }
  .el-table--mini {
    font-size: 14px;
  }
  .fantuan-pagination {
    margin-top: 26px;
  }
  .text{
    white-space: 'nowrap';
    word-break: 'normal'
  }
  .el-button--text {
    padding: 0 !important;
  }
}
</style>