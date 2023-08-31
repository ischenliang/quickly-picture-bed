<template>
  <div class="plugin-detail-container">
    <div class="plugin-detail-toolbar">
      <span>返回</span>
      <template v-if="pluginDetail.user_plugin.id">
        <el-button v-if="pluginDetail.user_plugin.status" type="danger" size="small">启用插件</el-button>
        <el-button v-else type="primary" size="small">禁用插件</el-button>
      </template>
    </div>
    <div class="plugin-detail-info">
      <div class="plugin-detail-info-left">
        <img :src="pluginDetail.logo || 'https://downloads-51growth.oss-cn-beijing.aliyuncs.com/assets/img/apps/claude.svg'" alt="">
        <template v-if="pluginDetail.user_plugin.id">
          <span class="plugin-detail-status status-success" v-if="pluginDetail.user_plugin.status">已启用</span>
          <span class="plugin-detail-status status-danger" v-else>已禁用</span>
        </template>
        <template v-else>
          <span class="plugin-detail-status status-info">未安装</span>
        </template>
        <div class="plugin-detail-platform">{{ pluginDetail.platform }}</div>
      </div>
      <div class="plugin-detail-info-right">
        <div class="plugin-detail-info-title">
          <span>{{ pluginDetail.title }}</span>
          <span class="plugin-detail-version">1.0.4</span>
        </div>
        <div class="plugin-detail-info-meta">
          <span>作者: {{ pluginDetail.author }}</span>
          <span class="meta-divider">|</span>
          <span>安装次数: {{ pluginDetail.downloadCounts }}</span>
          <span class="meta-divider">|</span>
          <span>插件类型: {{ pluginDetail.category }}</span>
        </div>
        <div class="plugin-detail-info-desc">{{ pluginDetail.description }}</div>
        <div class="plugin-detail-info-tags">
          <span class="plugin-detail-info-payment">
            {{ payment_types[pluginDetail.payment_type] }}
            <span v-if="pluginDetail.price > 0">({{ pluginDetail.price }}元)</span>
          </span>
          <el-tag
            v-for="(item, index) in pluginDetail.tags"
            :key="index">{{ item }}</el-tag>
        </div>
      </div>
      <div class="plugin-detail-info-action">
        <template v-if="pluginDetail.user_plugin.id">
          <el-button type="warning">卸载</el-button>
          <el-button v-if="pluginDetail.version !== pluginDetail.user_plugin.version" type="primary">更新</el-button>
        </template>
        <el-button v-else type="success">安装</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="plugin-detail-tabs">
      <el-tab-pane label="插件介绍" name="intro">
        <plugin-intro :detail="pluginDetail"></plugin-intro>
      </el-tab-pane>
      <el-tab-pane label="支持" name="support">Config</el-tab-pane>
      <el-tab-pane label="更新日志" name="uplog">
        <plugin-uplog :detail="pluginDetail"></plugin-uplog>
      </el-tab-pane>
      <el-tab-pane label="插件评价" name="comment">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import Plugin from '@/types/Plugin';
import { PluginInter } from '@/typings/interface';
import { Ref, computed, ref } from 'vue'
import { useRoute } from 'vue-router';
import useConfigStore from '@/store/config';
import PluginIntro from './plugin-intro.vue'
import PluginUplog from './plugin-uplog.vue'

/**
 * 实例
 */
const configStore = useConfigStore()
const plugin = new Plugin()
const route = useRoute()
const { plugin_id } = route.query

/**
 * 变量
 */
const activeName = ref('intro')
const pluginDetail: Ref<PluginInter> = ref({})
const payment_types = computed(() => {
  const types = configStore.dicts.find(el => el.code === 'plugin_payment_type').values || []
  return types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})

/**
 * 逻辑处理
 */
function getDetail () {
  if (plugin_id) {
    plugin.detail(+plugin_id).then((res: PluginInter) => {
      pluginDetail.value = res
    })
  }
}
getDetail()
</script>
<style lang="scss">
.plugin-detail-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  .plugin-detail {
    &-toolbar {
      height: 40px;
      padding: 0 20px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &-info {
      padding: 20px 40px;
      display: flex;
      position: relative;
      &-left {
        width: 150px;
        height: 150px;
        flex-shrink: 0;
        margin-right: 20px;
        position: relative;
        background-color: #000;
        border-radius: 6px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
        .plugin-detail-status {
          padding: 2px 8px;
          color: #fff;
          position: absolute;
          right: 0;
          border-radius: 0 6px 0 10px;
          font-size: 14px;
          &.status-success {
            background: #52c41a;
          }
          &.status-danger {
            background: #f56c6c;
          }
          &.status-info {
            background: #909399;
          }
        }
        .plugin-detail-platform {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          font-size: 12px;
          border-radius: 0 0 6px 6px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          padding: 4px 0;
        }
      }
      &-right {
        flex: 1;
      }
      &-title {
        font-size: 20px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }
      &-payment {
        position: relative;
        display: inline-block;
        padding: 0 12px;
        font-size: 12px;
        text-align: center;
        background-color: #e60012;
        color: #fff;
        height: 20px;
        line-height: 20px;
        background-color: #ef5656;
      }
      &-meta {
        margin-bottom: 10px;
        .meta-divider {
          margin: 0 8px;
        }
      }
      &-tags {
        margin-top: 8px;
        .el-tag {
          margin-left: 8px;
        }
      }
      &-action {
        flex-shrink: 0;
        padding-top: 10px;
        position: absolute;
        right: 40px;
      }
      &-desc {
        line-height: 24px;
        height: 48px;
        font-size: 14px;
        text-align: justify;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    &-version {
      padding: 2px 5px;
      font-size: 12px;
      background: #d9d9d9;
      border-radius: 4px;
      margin-left: 12px;
    }
  }
  .plugin-detail-tabs {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .el-tabs__nav-scroll {
      padding: 0 40px;
    }
    .el-tabs__header {
      flex-shrink: 0;
    }
    .el-tabs__content {
      flex: 1;
      .el-tab-pane {
        width: 100%;
        height: 100%;
        padding: 10px 40px;
        overflow: auto;
      }
    }
  }
}
</style>