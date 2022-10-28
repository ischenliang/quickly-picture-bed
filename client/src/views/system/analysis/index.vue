<template>
  <div style="padding: 30px;">
    <p style="color: red;">需要根据角色来判断显示什么样的统计，例如：管理员查看则是看平台所有的数据，其他角色则是看自己相关的数据即可。</p>
    图片数量、存储桶数量、占用总存储量、动态数量(图片操作、系统操作)、用户数量
    <div style="width: 100%;">
      <div style="margin: 0 auto;text-align: center;margin-bottom: 10px;font-weight: bold;">贡献度</div>
      <div class="calender-heatmap">
        <calendar-heatmap
          :no-data-text="false"
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
            <span>最近一年贡献：506 次</span>
            <span>最长连续贡献：7 日</span>
            <span>最近连续贡献：7 日</span>
          </template>
        </calendar-heatmap>
        <div class="vch__tips">贡献度的统计数据包括代码提交、创建任务 / Pull Request、合并 Pull Request，其中代码提交的次数需本地配置的 git 邮箱是 Gitee 帐号已确认绑定的才会被统计。</div>
      </div>
    </div>
    近期动态、存储桶概况、动态分布图
  </div>
</template>

<script lang="ts" setup>
import Log from '@/types/Log';
import { useFormatTime } from '@/typings/date-time';
import moment from 'moment';
import { Ref, ref } from 'vue';
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
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
const getLogs = () => {
  log.contributes({}).then((res: LogCount[]) => {
    logs.value = res
  })
}
getLogs()


const handlClick = (day) => {
  console.log(day)
}

const tooltipFormat = (val) => {
  return val.count + '个贡献: ' + useFormatTime(val.date, 'YYYY-MM-DD')
}
</script>

<style lang="scss">
.calender-heatmap {
  max-width: 900px;
  font-size: 12px;
  margin: 0 auto;
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
</style>