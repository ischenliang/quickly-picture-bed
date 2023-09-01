<template>
  <div class="plugin-item">
    <div class="plugin-item-header">
      <div class="plugin-item-category">
        <el-icon :size="18" color="#00b8d4"><UploadFilled /></el-icon>
        <span>{{ detail.category }}插件</span>
      </div>
      <div class="plugin-item-env">
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
      <span
        class="plugin-item-tag"
        v-for="(item, index) in detail.tags"
        :key="'tag-' + index">
        {{ item }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useConfigStore from '@/store/config';
import { PluginInter } from '@/typings/interface';
import { computed } from 'vue';
import { useFromNow } from '@/hooks/date-time'

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
const payment_types = computed(() => {
  return configStore.payment_types.reduce((total, cur) => {
    total[cur.value as string] = cur.label
    return total
  }, {})
})
</script>
<style lang="scss">
.plugin-item {
  // border: 1px solid #00b8d4;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 0.2rem 0.5rem #0000000d,0 0 0.05rem #0000001a;
  width: 100%;
  height: 231px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: all .3s;
  background: #fff;
  &-header {
    height: 36px;
    // background: #00b8d41a;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px 0 10px;
    flex-shrink: 0;
    .plugin-item {
      &-category {
        // color: #0db3a6;
        // color: #00b8d4;
        // color: #007bff;
        // font-weight: bold;
        color: #0db3a6;
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
          background: #00b8d4;
          font-size: 12px;
          border-radius: 10px;
          color: #fff;
          transform: scale(0.95);
          margin-right: 3px;
          display: flex;
          align-items: center;
          &.env-platform {
            background: #007bff;
          }
          &.env-installed, &.env-version {
            border-radius: 4px;
          }
          .env-version-dot {
            width: 6px;
            height: 6px;
            background: red;
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
          img {
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
          .plugin-item-platform {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            font-size: 12px;
            border-radius: 0 0 10px 10px;
            height: 18px;
            color: #fff;
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
            background: #e3eafd;
            color: #1c3f94;
          }
          &.limited-free {
            background: #fbebd5;
            color: #86511c;
          }
          &.paid {
            background: #ff6728;
            color: #fff;
          }
        }
        &-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          &-line {
            display: flex;
            margin-top: 5px;
            font-size: 14px;
            .info-divider {
              margin: 0 8px;
              color: rgba(0,0,0,0.3);
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
        color: #646a73;
        font-size: 14px;
      }
    }
  }
  &-footer {
    padding: 0 15px 10px 15px;
    flex-shrink: 0;
    .plugin-item-tag {
      padding: 2px 5px;
      // background: #ccc;
      font-size: 12px;
      margin-right: 5px;
      border-radius: 4px;
      border: 1px solid #ddd;
      color: #333;
    }
  }
  &:hover {
    transform: translateY(-10px);
  }
}
</style>