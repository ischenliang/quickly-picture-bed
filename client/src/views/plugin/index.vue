<template>
  <div class="plugin-container">
    <div class="plugin-toolbar">
      <div class="plugin-toolbar-filter">
        <el-input v-model="list.filters.search" placeholder="请输入插件名称" />
        <el-select v-model="list.filters.category" placeholder="请选择插件类别">
          <el-option
            v-for="(item, index) in plugin_types"
            :key="'type-' + index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="listGet">查询</el-button>
        <el-button type="default" @click="resetFilter">重置</el-button>
      </div>
    </div>
    <el-row class="plugin-list" v-loading="list.loading">
      <template v-if="list.data.length">
        <el-col :xl="6" :lg="8" :md="12" v-for="(item, index) in list.data" :key="index">
          <plugin-item :detail="item" @click="handleClick(item)"></plugin-item>
        </el-col>
      </template>
      <template v-else>
        <c-empty></c-empty>
      </template>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import Plugin from '@/types/Plugin';
import pluginItem from './plugin-item.vue';
import { ListInter, PluginInter } from '@/typings/interface';
import { Ref, ref, reactive, computed } from 'vue';
import { PageResponse } from '@/typings/req-res';
import { useRouter } from 'vue-router';
import useConfigStore from '@/store/config';
import cEmpty from '@/components/cEmpty.vue'
/**
 * 实例
 */
const plugin = new Plugin()
const router = useRouter()
const configStore = useConfigStore()

/**
 * 变量
 */
const list: ListInter<PluginInter> = reactive({
  page: 1,
  size: 10,
  total: 0,
  filters: {
    search: '',
    category: ''
  },
  loading: false,
  data: []
})
const plugin_types = computed(() => {
  return [
    { label: `全部（${list.total}）`, value: '' },
    ...configStore.dicts.find(el => el.code === 'plugin_type').values || []
  ]
})


/**
 * 逻辑处理
 */
// 获取数据
function listGet () {
  list.loading = true
  plugin.find({
    status: true,
    ...list.filters
  }).then((res: PageResponse<PluginInter>) => {
    list.data = res.items
    list.total = res.total
    list.loading = false
  })
}
listGet()
// 点击跳转
function handleClick (item: PluginInter) {
  router.push({
    name: 'PluginDetail',
    query: {
      plugin_id: item.id
    }
  })
}
// 重置筛选
function resetFilter () {
  Object.keys(list.filters).forEach(key => {
    if (typeof list.filters[key] === 'number') {
      list.filters[key] = 0
    } else {
      list.filters[key] = ''
    }
  })
  listGet()
}
</script>
<style lang="scss">
.plugin-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .plugin-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0 0 10px;
    &-filter {
      display: flex;
      align-items: center;
      > .el-input, > .el-select {
        width: 11.5rem;
      }
      :not(:first-child) {
        margin-left: 15px;
      }
    }
    &-action {
      flex-shrink: 0;
    }
  }
  .el-row {
    &.plugin-list {
      flex: 1;
      background: #fff;
    }
    .el-col {
      padding: 10px;
    }
  }
} 
</style>