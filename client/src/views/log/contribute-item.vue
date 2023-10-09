<template>
  <div class="contributes-container">
    <div class="calender-title">系统贡献度</div>
    <div class="calender-heatmap">
      <calendar-heatmap
        :no-data-text="'当日无贡献'"
        :values="logs"
        :round="0"
        :end-date="endDate"
        :tooltip-unit="'贡献'"
        :locale="{
          less: '少',
          more: '多',
          on: '',
          days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }"
        :vertical="false"
        :tooltip-formatter="tooltipFormat"
        :range-color="['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e']"
        @day-click="handlClick">
        <template #vch__legend-left>
          <span>最近一年贡献：xxx 次</span>
          <span>最长连续贡献：xx 日</span>
          <span>最近连续贡献：xx 日</span>
        </template>
      </calendar-heatmap>
      <div class="vch__tips">贡献度的统计数据包括上传图片、删除图片、更新图片、登录记录，其中批量上传的图片会根据实际成功上传的图片数量来记录次数。</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Log from '@/types/Log';
import { Ref, ref } from 'vue';
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import moment from 'moment';
import { useFormatTime } from '@/typings/date-time';
interface LogCount {
  date: string
  count: number
}
/**
 * 实例
 */
const log = new Log()

/**
 * 变量
 */
// 贡献列表
const logs: Ref<LogCount[]> = ref([])
// 结束日期
const endDate = ref(moment().format('YYYY-MM-DD'))
  
/**
 * 数据获取 
 */
function getLogs () {
  log.contributes({}).then((res: LogCount[]) => {
    logs.value = res
  })
}
getLogs()
// 格式化
function tooltipFormat (val) {
  return val.count + '个贡献: ' + useFormatTime(val.date, 'YYYY-MM-DD')
}
// 点击贡献
function handlClick (day) {
  console.log(day)
}
</script>
<style lang="scss">
.contributes-container {
  width: 100%;
  background: #fff;
  padding: 15px;
  height: 100%;
  .calender-title {
    margin: 0 auto;
    text-align: center;
    margin-bottom: 15px;
    font-weight: bold;
  }
  .calender-heatmap {
    // max-width: 900px;
    // margin: 0 auto;
    font-size: 12px;
    .vch__legend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .vch__legend-left {
        span + span {
          margin-left: 20px;
        }
      }
      .vch__legend-right {
        margin-top: 5px;
        .vch__legend {
          svg {
            margin: 0 5px;
          }
        }
      }
    }
    .vch__tips {
      margin-top: 10px;
      color: #8c92a4;
      line-height: 1.33;
    }
  }
}
</style>