<template>
  <div class="plugin-container">
    <c-card :title="`插件市场(${list.total})`">
      <template #cardAction>
        <div class="plugin-filter">
          <el-select v-model="list.filters.category" placeholder="请选择插件类别" @change="listGet">
            <el-option
              v-for="(item, index) in plugin_types"
              :key="'type-' + index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input
            v-model="list.filters.search"
            placeholder="请输入搜索内容..."
            style="width: 180px;"
            :suffix-icon="'Search'"
            clearable
            @input="handleInput"/>
        </div>
      </template>
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
    </c-card>
  </div>
</template>
<script lang="ts" setup>
import Plugin from '@/types/Plugin';
import pluginItem from './plugin-item.vue';
import { ListInter, PluginInter } from '@/typings/interface';
import { Ref, ref, reactive, computed, nextTick } from 'vue';
import { PageResponse } from '@/typings/req-res';
import { useRouter } from 'vue-router';
import useConfigStore from '@/store/config';
import cEmpty from '@/components/cEmpty.vue'
import { useDragSort } from '@/hooks/global';
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
    { label: '全部插件', value: '' },
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

// 搜索
function handleInput (val) {
  setTimeout(() => {
    listGet()
  }, 1000)
}
</script>
<style lang="scss">
.plugin-container {
  width: 100%;
  height: 100%;
  .el-card__header {
    padding: 12px 20px;
  }
  .el-card__body {
    overflow: auto;
    padding: 10px;
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
  .plugin-filter {
    display: flex;
    gap: 15px;
    .el-select {
      width: 180px;
    }
  }
} 
</style>