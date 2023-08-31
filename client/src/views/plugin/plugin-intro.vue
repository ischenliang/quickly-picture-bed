<template>
  <div class="plugin-intro" v-loading="loading">
    <div class="plugin-intro-left">
      <md-preview :value="doc_md"></md-preview>
    </div>
    <div class="plugin-intro-right">
      <div class="intro-line">
        <div class="intro-line-title">插件类型</div>
        <div class="intro-line-content">
          <el-tag size="large">{{ detail.category }}</el-tag>
        </div>
      </div>
      <div class="intro-line">
        <div class="intro-line-title">是否收费</div>
        <div class="intro-line-content">
          <el-tag size="large">{{ detail.payment_type }}</el-tag>
        </div>
      </div>
      <div class="intro-line">
        <div class="intro-line-title">工作环境</div>
        <div class="intro-line-content">
          <el-tag size="large">{{ detail.platform }}</el-tag>
        </div>
      </div>
      <div class="intro-line">
        <div class="intro-line-title">更多信息</div>
        <div class="intro-line-content">
          <p><span>插件版本: </span>{{ detail.version }}</p>
          <p><span>插件作者: </span>{{ detail.author }}</p>
          <p><span>安装次数: </span>{{ detail.downloadCounts }}</p>
          <p><span>创建时间: </span>2023-08-31</p>
          <p><span>最近更新: </span>2023-08-31</p>
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

interface Props {
  detail: PluginInter
}

const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as PluginInter)
})
const url = computed(() => {
  const { name, version } = props.detail
  return `${PluginLoadUrl}${name}@${version}`
})
const doc_md = ref('')
const loading = ref(false)

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
      }
    }
  }
  &-left {
    flex: 1;
    overflow: hidden;
  }
} 
</style>