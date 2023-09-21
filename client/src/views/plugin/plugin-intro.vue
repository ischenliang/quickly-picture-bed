<template>
  <div class="plugin-intro" v-loading="loading">
    <div class="plugin-intro-left">
      <md-preview :value="doc_md"></md-preview>
    </div>
    <div class="plugin-intro-right">
      <div class="intro-line">
        <div class="intro-line-title">插件类型</div>
        <div class="intro-line-content">
          <el-tag>{{ plugin_types[detail.category] }}</el-tag>
        </div>
      </div>
      <div class="intro-line">
        <div class="intro-line-title">是否收费</div>
        <div class="intro-line-content">
          <el-tag>{{ payment_types[detail.payment_type] }}</el-tag>
          <el-tag effect="dark" v-if="detail.payment">
            <template v-if="detail.payment_type !== 'limited_free'">{{ detail.price }}元</template>
            <s v-else>{{ detail.price }}元</s>
          </el-tag>
        </div>
      </div>
      <div class="intro-line">
        <div class="intro-line-title">工作环境</div>
        <div class="intro-line-content">
          <el-tag>{{ platform_types[detail.platform] }}</el-tag>
        </div>
      </div>
      <div class="intro-line">
        <div class="intro-line-title">更多信息</div>
        <div class="intro-line-content">
          <p><span>插件版本: </span>{{ detail.version }}</p>
          <p><span>插件作者: </span>{{ detail.author }}</p>
          <p><span>安装次数: </span>{{ detail.downloadCounts }}</p>
          <p><span>创建时间: </span>{{ formatTime(detail.createdAt) }}</p>
          <p><span>最近更新: </span>{{ formatTime(detail.updatedAt) }}</p>
          <p v-if="detail.user_plugin.id"><span>安装时间: </span>{{ formatTime(detail.user_plugin.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PluginLoadUrl } from '@/global.config';
import { PluginInter } from '@/typings/interface';
import { computed, ref } from 'vue';
import mdPreview from './md-preview.vue';
import useConfigStore from '@/store/config'
import { useFormat } from '@/hooks/date-time'

interface Props {
  detail: PluginInter
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as PluginInter)
})
const configStore = useConfigStore()

/**
 * 变量
 */
const url = computed(() => {
  const { name, version } = props.detail
  return `${PluginLoadUrl}${name}@${version}`
})
const doc_md = ref('')
const loading = ref(false)
const payment_types = computed(() => {
  return configStore.payment_types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})
const platform_types = computed(() => {
  const types = configStore.dicts.find(el => el.code === 'plugin_env').values || []
  return types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})
const plugin_types = computed(() => {
  const types = configStore.dicts.find(el => el.code === 'plugin_type').values || []
  return types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})

/**
 * 逻辑处理
 */
function loadData () {
  // 处理更新日志和READEME.md
  loading.value = true
  fetch(`${url.value}/README.md`)
    .then(res => res.text())
    .then(res => {
      doc_md.value = res
      loading.value = false
    })
}
loadData()
function formatTime (time: string) {
  return useFormat(time, 'YYYY-MM-DD')
}
</script>
<style lang="scss">
.plugin-intro {
  display: flex;
  min-height: 100%;
  overflow: hidden;
  &-right {
    width: 300px;
    flex-shrink: 0;
    margin-left: 20px;
    .intro-line {
      margin-bottom: 25px;
      &-title {
        font-size: 16px;
        font-weight: bold;
        color: #555;
        margin-bottom: 10px;
      }
      &-content {
        p {
          line-height: 25px;
          font-size: 14px;
          color: #666;
        }
        .el-tag + .el-tag {
          margin-left: 8px;
        }
      }
    }
  }
  &-left {
    flex: 1;
    overflow: hidden;
  }
  .markdown-body {
    font-size: 16px !important;
    li {
      margin-bottom: 10px !important;
    }
  }
} 
</style>