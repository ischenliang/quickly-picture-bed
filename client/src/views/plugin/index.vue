<template>
  <div class="plugin-container">
    <el-row>
      <el-col :xl="6" :lg="8" :md="12" v-for="(item, index) in plugins" :key="index">
        <plugin-item :detail="item" @click="handleClick(item)"></plugin-item>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import Plugin from '@/types/Plugin';
import pluginItem from './plugin-item.vue';
import { PluginInter } from '@/typings/interface';
import { Ref, ref } from 'vue';
import { PageResponse } from '@/typings/req-res';
import { useRouter } from 'vue-router';
/**
 * 实例
 */
const plugin = new Plugin()
const router = useRouter()

/**
 * 变量
 */
const plugins: Ref<PluginInter[]> = ref([])


/**
 * 逻辑处理
 */
// 获取数据
function listGet () {
  plugin.find({}).then((res: PageResponse<PluginInter>) => {
    plugins.value = res.items
  })
}
listGet()
function handleClick (item: PluginInter) {
  router.push({
    name: 'PluginDetail',
    query: {
      plugin_id: item.id
    }
  })
}
</script>
<style lang="scss">
.plugin-container {
  .el-row {
    .el-col {
      padding: 10px;
    }
  }
} 
</style>