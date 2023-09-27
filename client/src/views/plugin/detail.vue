<template>
  <div class="plugin-detail-container">
    <div class="plugin-detail-toolbar">
      <div class="back-btn" @click="goBack">
        <el-icon><Back /></el-icon>
        <span>返回</span>
      </div>
      <template v-if="pluginDetail.user_plugin.id && route.name === 'PluginDetail'">
        <el-tooltip
          placement="bottom"
          effect="dark"
          :content="pluginDetail.user_plugin.status ? '禁用后，创建存储桶时将不会显示该插件' : '启用后，创建存储桶时会显示该插件'">
          <el-button
            v-if="pluginDetail.user_plugin.status"
            type="danger"
            size="small"
            :loading="loading.toggle"
            @click="togglePlugin">
            禁用插件
          </el-button>
          <el-button v-else type="primary" size="small" :loading="loading.toggle" @click="togglePlugin">启用插件</el-button>
        </el-tooltip>
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
        <div class="plugin-detail-platform">{{ platform_types[pluginDetail.platform] }}</div>
      </div>
      <div class="plugin-detail-info-right">
        <div class="plugin-detail-info-title">
          <span>{{ pluginDetail.title }}</span>
          <span class="plugin-detail-version">{{ pluginDetail.version }}</span>
        </div>
        <div class="plugin-detail-info-meta">
          <span>作者: {{ pluginDetail.author }}</span>
          <span class="meta-divider">|</span>
          <span>安装次数: {{ pluginDetail.downloadCounts }}</span>
          <span class="meta-divider">|</span>
          <span>插件类型: {{ plugin_types[pluginDetail.category] }}</span>
        </div>
        <div class="plugin-detail-info-desc">{{ pluginDetail.description }}</div>
        <div class="plugin-detail-info-tags">
          <span class="plugin-detail-info-payment">
            {{ payment_types[pluginDetail.payment_type] }}
            <span v-if="pluginDetail.payment">
              (<span>
                <template v-if="pluginDetail.payment_type !== 'limited_free'">{{ pluginDetail.price }}元</template>
                <s v-else>{{ pluginDetail.price }}元</s>
              </span>)
            </span>
          </span>
          <el-tag
            v-for="(item, index) in pluginDetail.tags"
            :key="index">{{ item }}</el-tag>
        </div>
      </div>
      <div class="plugin-detail-info-action" v-if="route.name === 'PluginDetail'">
        <template v-if="pluginDetail.user_plugin.id">
          <el-button type="warning" @click="handleUninstall" :loading="loading.uninstall">卸载</el-button>
          <el-button
            v-if="pluginDetail.version !== pluginDetail.user_plugin.version"
            type="primary"
            :loading="loading.update"
            @click="handleUpdateInstall">更新</el-button>
        </template>
        <el-button v-else type="success" @click="handleInstall" :loading="loading.install">安装</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="plugin-detail-tabs">
      <el-tab-pane label="插件介绍" name="intro">
        <plugin-intro :detail="pluginDetail"></plugin-intro>
      </el-tab-pane>
      <el-tab-pane label="支持" name="support">
        <plugin-support :detail="pluginDetail"></plugin-support>
      </el-tab-pane>
      <el-tab-pane label="更新日志" name="uplog">
        <plugin-uplog :detail="pluginDetail"></plugin-uplog>
      </el-tab-pane>
      <!-- <el-tab-pane label="插件评价" name="comment">Task</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import Plugin from '@/types/Plugin';
import { PluginInter } from '@/typings/interface';
import { Ref, computed, h, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useConfigStore from '@/store/config';
import PluginIntro from './plugin-intro.vue'
import PluginUplog from './plugin-uplog.vue'
import PluginSupport from './plugin-support.vue'
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global';
import { ElMessageBox } from 'element-plus'

/**
 * 实例
 */
const configStore = useConfigStore()
const plugin = new Plugin()
const router = useRouter()
const route = useRoute()
const ctx = useCtxInstance()
const { plugin_id } = route.query

/**
 * 变量
 */
const activeName = ref('intro')
const pluginDetail: Ref<PluginInter> = ref({})
const payment_types = computed(() => {
  return configStore.payment_types.reduce((total, cur) => {
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
const platform_types = computed(() => {
  const types = configStore.dicts.find(el => el.code === 'plugin_env').values || []
  return types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})
const secret_key = ref('')
const loading = reactive({
  install: false,
  uninstall: false,
  update: false,
  toggle: false
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
// 返回
function goBack () {
  const { name } = route
  if (name === 'SystemPluginDetail') {
    return router.push({
      name: 'SystemPlugin'
    })
  } else {
    return router.push({
      name: 'Plugin'
    })
  }
}
// 切换插件状态
function togglePlugin () {
  useDeleteConfirm(`是否确定${ pluginDetail.value.user_plugin.status ? '禁用' : '启用' }该插件？`).then(() => {
    loading.toggle = true
    plugin.toggleIntsall(pluginDetail.value.user_plugin.id).then(() => {
      const { status } = pluginDetail.value.user_plugin
      ctx.$message({ message: status ? '禁用成功' : '启用成功', type: 'success', duration: 1000 })
      getDetail()
      loading.toggle = false
    })
  })
}
// 更新安装插件
function handleUpdateInstall () {
  useDeleteConfirm('是否确定更新插件').then(() => {
    loading.update = true
    plugin.updateInstall(pluginDetail.value.id).then(() => {
      ctx.$message({ message: '更新成功', type: 'success', duration: 1000 })
      getDetail()
      loading.update = false
    })
  })
}
// 卸载插件
function handleUninstall () {
  // 判断该插件是否为付费插件
  const { payment, price, id, payment_type } = pluginDetail.value
  if (payment && payment_type === 'paid') {
    uninstallPlugin(id, '该插件是付费插件，卸载后需要再安装需要填写安装秘钥，是否确定卸载')
  } else {
    uninstallPlugin(id)
  }
}
function uninstallPlugin (id: number, text: string = '该操作将删除关联的存储桶，是否确定卸载该插件？') {
  useDeleteConfirm(text).then(() => {
    loading.uninstall = true
    plugin.uninstall(id).then(() => {
      ctx.$message({ message: '更新成功', type: 'success', duration: 1000 })
      getDetail()
      loading.uninstall = false
    })
  })
}
// 安装插件
function handleInstall () {
  const { payment, price, id, payment_type } = pluginDetail.value
  if (payment && payment_type === 'paid') {
    ElMessageBox.prompt('提示', '请输入安装秘钥，该秘钥找客服生成', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{10}$/,
      inputErrorMessage: '请填写长度为10的安装秘钥'
    }).then(({ value }) => {
      installPlugin(id, value)
    }).catch(() => {})
  } else {
    installPlugin(id)
  }
}
function installPlugin (id: number, value: string = '') {
  useDeleteConfirm('是否确定安装该插件？').then(() => {
    loading.install = true
    plugin.install(id, value).then(res => {
      getDetail()
      ctx.$message({ message: '插件安装成功', type: 'success', duration: 1000  })
      loading.install = false
    })
  })
}
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
        background-color: #e2e2e2;
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
  .back-btn {
    padding: 5px 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
    span {
      margin-left: 5px;
    }
    &:hover {
      background: #dfdfdf;
    }
  }
}
</style>