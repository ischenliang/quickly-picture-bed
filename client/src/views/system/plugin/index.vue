<template>
  <div class="backstage-account-plugin">
    <table-page
      :table-data="list"
      :is-index="true"
      :border="true"
      @pageChange="listGet"
      :actionWidth="260">
      <template #filter>
        <filter-item :text="'插件名称:'">
          <el-input v-model="list.filters.name" placeholder="请输入插件名称" @input="handleInput" />
        </filter-item>
        <filter-item :text="'插件类别:'">
          <el-input v-model="list.filters.name" placeholder="请输入插件名称" @input="handleInput" />
        </filter-item>
      </template>
      <template #action>
        <el-button type="primary" @click="itemOperate(null, 'edit')">新增</el-button>
      </template>
      <template #logo="data">
        <img :src="data.logo || 'http://localhost:5174/src/views/userinfo/images/%E6%98%9F%E5%BA%A7_%E7%99%BD%E7%BE%8A%E5%BA%A7.png'" alt="" class="plugin-logo">
      </template>
      <template #status="data">
        <el-tag :type="data.status ? 'success' : 'danger'">{{ data.status ? '已启用' : '已禁用' }}</el-tag>
      </template>
      <template #payment="data">
        {{ plugin_payment_type[data.payment_type] }}
        <span v-if="data.payment">(<span style="color: red;">{{ data.price }}元</span>)</span>
      </template>
      <template #updatedAt="data">
        {{ useFromNow(data.updatedAt) }}
      </template>
      <template #tableAction="{ row }">
        <el-button type="primary" size="small" @click="itemOperate(row, 'edit')">更新</el-button>
        <el-button
          :type="row.status ? 'warning' : 'info'"
          size="small"
          @click="itemOperate(row, 'switch')">
          {{ row.status ? '禁用' : '启用' }}
        </el-button>
        <el-button type="success" size="small" @click="itemOperate(row, 'detail')">预览</el-button>
        <el-button type="danger" size="small" @click="itemOperate(row, 'delete')">删除</el-button>
      </template>
    </table-page>
    <edit-plugin
      v-if="visible.edit"
      v-model="visible.edit"
      :detail="item.data"
      @submit="listGet">
    </edit-plugin>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { config } from './config'
import { ListInter, PluginInter } from '@/typings/interface'
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { PageResponse } from '@/typings/req-res'
import { useFormat } from '@/hooks/date-time'
import Plugin from '@/types/Plugin'
import editPlugin from './edit-plugin.vue'
import useConfigStore from "@/store/config"
import { useFromNow } from '@/hooks/date-time'
/**
 * 实例
 */
const ctx = useCtxInstance()
const plugin = new Plugin()
const configStore = useConfigStore()

/**
 * 变量
 */
const list: ListInter<PluginInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  config,
  filters: {
    search: '',
    category: ''
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
const plugin_payment_type = computed(() => {
  const data = configStore.dicts.find(el => el.code === 'plugin_payment_type').values || []
  let obj = {}
  data.forEach(el => {
    obj[el.value as string] = el.label
  })
  return obj
})

/**
 * 逻辑处理
 */
// 获取数据
const listGet = () => {
  plugin.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<PluginInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
  })
}
listGet()
// 操作
const itemOperate = (data: any, type) => {
  item.data = data
  visible[type] = true
  if (type === 'delete') {
    useDeleteConfirm().then(() => {
      plugin.delete(data.id).then(res => {
        ctx.$message({ type: 'success', duration: 1000, message: '删除成功' })
        listGet()
      })
    })
  }
  if (type === 'switch') {
    useDeleteConfirm(`确定要${ data.status ? '禁用' : '启用' }该存储源插件吗？`).then(() => {
      plugin.toggle(data.id).then(res => {
        ctx.$message({ type: 'success', duration: 1000, message: `${ data.status ? '禁用' : '启用' }成功` })
        listGet()
      })
    })
  }
}
function handleInput (e) {
  debounce(() => {
    listGet()
  }, 2000)()
}
// 防抖
function debounce(callback, time) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(args)
    }, time)
  }
}

/**
 * 回调函数
 */
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.backstage-account-plugin {
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
  .plugin-icon {
    font-size: 22px;
  }
  .plugin-logo {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
</style>