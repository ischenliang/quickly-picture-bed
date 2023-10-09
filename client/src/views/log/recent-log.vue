<template>
  <!-- 近期动态(统计近七天的动态) -->
  <div class="recent-log">
    <div class="recent-log__header">近期动态(近一周)</div>
    <div class="recent-log__content">
      <log-item v-for="(item, index) in [...logs, ...logs]" :key="index" :log="item"></log-item>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { LogInter } from '@/typings/interface';
import {Ref, ref} from 'vue'
import LogItem from '@/components/web/log/item.vue'
import Log from '@/types/Log';
import { useFormatTime } from '@/typings/date-time';

/**
 * 实例
 */
const log = new Log()

/**
 * 变量
 */
const logs: Ref<LogInter[]> = ref([])


// 获取近期动态
function getRecentLogs () {
  log.rencentLog().then((res: LogInter[]) => {
    logs.value = res.map(el => {
      el.createdAt = useFormatTime(el.createdAt)
      return el
    })
  })
}
getRecentLogs()
</script>
<style lang="scss">
@import './theme.scss';
.recent-log {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bgcolor;
  overflow: hidden;
  &__header {
    display: flex;
    justify-content: center;
    font-weight: bold;
    padding: 15px 15px 5px;
  }
  &__content {
    padding: 0 15px 15px;
    overflow: auto;
    flex: 1;
  }
}
</style>