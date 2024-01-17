<template>
  <div class="plugin-item">
    <drag-box v-if="draggable"></drag-box>
    <div class="plugin-item-header">
      <div class="plugin-item-category">
        <el-icon :size="18"><UploadFilled /></el-icon>
        <span>{{ plugin_types[detail.category] }}</span>
      </div>
      <div class="plugin-item-env">
        <template v-if="editable">
          <div v-if="detail.status" class="plugin-item-env-item env-enabled">已启用</div>
          <div v-else class="plugin-item-env-item env-disabled">已禁用</div>
          <div class="plugin-item-env-item env-version">{{ detail.version }}</div>
        </template>
        <template v-else>
          <div class="plugin-item-env-item env-installed" v-if="detail.user_plugin.id">已安装</div>
          <template v-if="detail.user_plugin.id">
            <template v-if="detail.user_plugin.version === detail.version">
              <div class="plugin-item-env-item env-version">{{ detail.version }}</div>
            </template>
            <template v-else>
              <el-tooltip
                effect="dark"
                :content="'有新版本，最新版本: ' + detail.version"
                placement="right">
                <div class="plugin-item-env-item env-version">
                  <span class="env-version-dot"></span>
                  {{ detail.user_plugin.version }}
                </div>
              </el-tooltip>
            </template>
          </template>
          <template v-else>
            <div class="plugin-item-env-item env-version">{{ detail.version }}</div>
          </template>
        </template>
      </div>
    </div>
    <div class="plugin-item-main">
      <div class="plugin-item-main__header">
        <div class="plugin-item-logo">
          <img :src="detail.logo" :alt="detail.title">
          <div class="plugin-item-platform">{{ detail.platform }}</div>
        </div>
        <div class="plugin-item-info">
          <div class="plugin-item-info-line plugin-item-title">
            <p>{{ detail.title }}</p>
          </div>
          <div class="plugin-item-info-line">
            <span><el-icon><User /></el-icon> {{ detail.author }}</span>
            <span class="info-divider">|</span>
            <span><el-icon><Download /></el-icon>{{ detail.downloadCounts }}</span>
          </div>
          <div class="plugin-item-info-line">
            <span>更新于 {{ useFromNow(detail.updatedAt) }}</span>
          </div>
        </div>
        <div :class="{
          'plugin-item-payment': true,
          'free': detail.payment_type === 'free',
          'limited-free': detail.payment_type === 'limited_free',
          'paid': detail.payment_type === 'paid'
        }">{{ payment_types[detail.payment_type] }}</div>
      </div>
      <div class="plugin-item-main__content">
        <div class="plugin-item-desc">{{ detail.description }}</div>
      </div>
    </div>
    <div class="plugin-item-footer">
      <div class="plugin-item-tags">
        <span
          class="plugin-item-tag"
          v-for="(item, index) in detail.tags"
          :key="'tag-' + index">
          {{ item }}
        </span>
      </div>
      <div class="plugin-item-action" v-if="editable" @click.stop="">
        <el-dropdown trigger="hover" placement="bottom-end" @command="(func) => func()">
          <icon-more :size="18"></icon-more>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="() => handleCommond('edit')"><el-icon><Edit /></el-icon>更新插件</el-dropdown-item>
              <el-dropdown-item :command="() => handleCommond('switch')"><el-icon><SwitchButton /></el-icon>{{ detail.status ? '禁用' : '启用' }}插件</el-dropdown-item>
              <el-dropdown-item :command="() => handleCommond('delete')"><el-icon><Delete /></el-icon>删除插件</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useConfigStore from '@/store/config';
import { PluginInter } from '@/typings/interface';
import { computed } from 'vue';
import { useFromNow } from '@/hooks/date-time'
import iconMore from '@/components/icons/icon-more.vue'
import dragBox from '@/components/dragBox.vue';

interface Props {
  detail: PluginInter
  editable?: boolean
  draggable?: boolean
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  detail: () => ({} as PluginInter),
  editable: false,
  draggable: false
})
const configStore = useConfigStore()
const emit = defineEmits(['action'])
const plugin_types = computed(() => {
  const obj: any = {}
  configStore.dicts.find(el => el.code === 'plugin_type').values.forEach(el => {
    obj[el.value + ''] = el.label
  })
  return obj
})

/**
 * 变量
 */
const payment_types = computed(() => {
  return configStore.payment_types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})

/**
 * 逻辑处理
 */
function handleCommond (type: string) {
  emit('action', {
    type,
    data: props.detail
  })
}
</script>
<style lang="scss">
.plugin-item {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-lighter);
  width: 100%;
  height: 231px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: all .3s;
  background: var(--el-bg-color-white);
  position: relative;
  &-header {
    height: 36px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px 0 10px;
    flex-shrink: 0;
    .plugin-item {
      &-category {
        color: var(--el-color-success);
        font-size: 14px;
        display: flex;
        align-items: center;
        overflow: hidden;
        .el-icon {
          margin-right: 5px;
          flex-shrink: 0;
        }
        > span {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      &-env {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        margin-left: 5px;
        &-item {
          padding: 1px 7px;
          background: var(--el-color-success);
          font-size: 12px;
          border-radius: 10px;
          color: var(--el-color-white);
          transform: scale(0.95);
          margin-right: 3px;
          display: flex;
          align-items: center;
          &.env-platform {
            background: var(--el-color-primary);
          }
          &.env-installed, &.env-version, &.env-disabled, &.env-enabled {
            border-radius: 4px;
          }
          &.env-disabled {
            background: var(--el-color-danger);
          }
          &.env-enabled {
            background: var(--el-color-success);
          }
          .env-version-dot {
            width: 6px;
            height: 6px;
            background: var(--el-color-danger);
            border-radius: 50%;
            margin-right: 5px;
          }
        }
      }
    }
  }
  &-title {
    padding-right: 60px;
    overflow: hidden;
    p {
      font-size: 15px;
      font-weight: bold;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  &-main {
    flex: 1;
    padding: 15px 5px 15px 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &__header {
      display: flex;
      position: relative;
      .plugin-item {
        &-logo {
          width: 80px;
          height: 80px;
          margin-right: 10px;
          flex-shrink: 0;
          position: relative;
          border-radius: 6px;
          border: 1px solid var(--el-border-color-lighter);
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
          }
          .plugin-item-platform {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: var(--el-bg-color-plugin-tag);
            font-size: 12px;
            border-radius: 0 0 6px 6px;
            height: 18px;
            color: var(--el-color-white);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 18px;
            text-align: center;
          }
        }
        &-payment {
          padding: 2px 8px;
          font-size: 12px;
          border-radius: 4px;
          transform: scale(0.95);
          position: absolute;
          top: 6px;
          right: 0px;
          &.free {
            background: var(--el-fill-color-darker);
            color: var(--el-color-primary-light-3);
          }
          &.limited-free {
            background: var(--el-color-warning-light-8);
            color: var(--el-color-warning);
          }
          &.paid {
            background: var(--el-color-danger);
            color: var(--el-color-white);
          }
        }
        &-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: var(--el-text-color-primary);
          &-line {
            display: flex;
            margin-top: 5px;
            font-size: 14px;
            .info-divider {
              margin: 0 8px;
              color: var(--el-border-color-darker);
            }
            span {
              display: flex;
              align-items: center;
              .el-icon {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
    &__content {
      flex: 1;
      margin-top: 12px;
      overflow: hidden;
      padding-right: 10px;
      .plugin-item-desc {
        line-height: 20px;
        height: 40px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: var(--el-text-color-regular);
        font-size: 14px;
      }
    }
  }
  &-footer {
    padding: 0 15px 10px 15px;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    .plugin-item-tag {
      padding: 2px 5px;
      font-size: 12px;
      margin-right: 8px;
      border-radius: 6px;
      border: 1px solid var(--el-border-color-lighter);
      color: var(--el-text-color-regular);
      background: var(--el-bg-color-plugin-tag);
      flex-shrink: 0;
    }
    .plugin-item-tags {
      flex: 1;
      overflow: hidden;
      height: 24px;
      display: flex;
      flex-wrap: nowrap;
    }
    .plugin-item-action {
      width: 24px;
      height: 21px;
      border-radius: 4px;
      background: var(--el-fill-color-dark);
      flex-shrink: 0;
      margin-left: 5px;
      justify-content: center;
      align-items: center;
      display: flex;
      color: var(--el-text-color-regular);
      svg {
        color: var(--el-text-color-regular);
      }
    }
  }
  &:hover {
    transform: translateY(-10px);
  }
}
</style>