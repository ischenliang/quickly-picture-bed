<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-shrink: 0;
  margin-top: 5px;
}
</style>
<template>
  <div class="pagination">
    <el-pagination
      :layout="layout"
      :current-page="page"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :pager-count="pager"
      :hide-on-single-page="singleHide"
      background
      @current-change="listPageChange"
      @size-change="listPageSizeChange" />
  </div>
</template>
  
<script lang="ts" setup>
import { computed, ref, toRaw, watch } from 'vue'
/**
 * 实例
 */
const props = defineProps({
  page: { // 当前页码
    type: Number,
    default: 1
  },
  size: { // 每页显示数量
    type: Number,
    default: 20
  },
  total: { // 总数量
    type: Number,
    default: 0
  },
  sizeChangeable: { // 是否可以更改每页显示数量
    type: Boolean,
    default: true
  },
  pager: { // 显示几个页码
    type: Number,
    default: 5
  },
  singleHide: {
    type: Boolean,
    default: true
  },
  pageSizes: {
    type: Array,
    default: [10, 20, 30, 40, 50, 100]
  }
})
const emit = defineEmits(['change', 'update:page', 'update:size', 'page-change'])

/**
 * 变量
 */
const layout = computed(() => {
  if (props.sizeChangeable) {
    // 'total, sizes, prev, pager, next, jumper'
    return 'total, sizes, prev, pager, next, jumper'
  } else {
    return 'total, prev, pager, next, jumper'
  }
})

const pageNum = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})
const pageSize = computed({
  get: () => props.size,
  set: (val) => emit('update:size', val)
})

/**
 * 回调函数
 */
// 当前页发生变化时触发
const listPageChange = (page) => {
  pageNum.value = page
  emit('change')
  emit('page-change', { type: 'page', page: page })
}
// pageSize 改变时会触发
const listPageSizeChange = (size) => {
  let maxPage = Math.floor(props.total / size)
  if (props.total % size !== 0) {
    maxPage++
  }
  if (props.page > maxPage) {
    pageSize.value = maxPage
    emit('page-change', { type: 'page', page: maxPage })
  } else {
    pageSize.value = size
    emit('page-change', { type: 'size', size: size })
  }
  emit('change')
}

// 根据判断是否传入size，如果有传入则使用传入的值
// 没有传入则直接使用pageSizes的第一项
watch(() => props.size, (val, old) => {
  if (old) {
    pageSize.value = val
  } else {
    pageSize.value = toRaw(props.pageSizes[0] as number)
  }
}, {
  immediate: true
})
</script>
  