// 全局组件注册
import cButton from '@/components/cButton.vue'
// 方式一
// export default function (app, option) {
//   app.component('c-button', cButton)
// }

import tableTable from '@/components/table/tableTable.vue' // 表格
import tablePage from '@/components/table/tablePage.vue' // 表格
import tableCard from '@/components/table/tableCard.vue' // 表格
import pagination from '@/components/table/pagination.vue' // 表格


// 筛选栏
import filterInput from '@/components/filter/index.vue' // 筛选栏容器
import filterItem from '@/components/filter/item.vue' // 筛选栏某一项

// 弹框
import ComDialog from '@/components/dialog/index.vue'

// element-plus封装
import cCard from '@/components/el-component/cCard.vue'
import cTabs from '@/components/el-component/cTabs.vue'

// 方式二
export default {
  install (app, option) {
    app.component('c-button', cButton)
    app.component('tableTable', tableTable)
    app.component('tablePage', tablePage)
    app.component('tableCard', tableCard)
    app.component('filterInput', filterInput)
    app.component('filterItem', filterItem)
    app.component('pagination', pagination)
    app.component('ComDialog', ComDialog)
    app.component('cCard', cCard)
    app.component('cTabs', cTabs)
  }
}