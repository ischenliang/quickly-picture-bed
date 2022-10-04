<style lang="scss" scoped>
  .pagination{
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
        :page-size="size"
        :page-sizes="[5, 10, 20, 50, 100]"
        :pager-count="pager"
        :hide-on-single-page="singleHide"
        background
        @current-change="listPageChange"
        @size-change="listPageSizeChange"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue'
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
      default: false
    }
  })
  const emit = defineEmits(['change'])
  
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
  
  /**
   * 回调函数
   */
  // 当前页发生变化时触发
  const listPageChange = (page) => {
    emit('change', { type: 'page', page: page })
  }
  // pageSize 改变时会触发
  const listPageSizeChange = (size) => {
    let maxPage = Math.floor(props.total / size)
    if (props.total % size !== 0) {
      maxPage++
    }
    if (props.page > maxPage) {
      emit('change', { type: 'page', page: maxPage })
    }
    emit('change', { type: 'size', size: size })
  }
  </script>
  