<template>
  <div style="padding: 30px;">
    <div style="width: 100%;">
      <!-- 
        :range-color="['#ebedf0', '#dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e']"
        :range-color="['rgb(255, 194, 255)','rgb(255, 153, 255)','rgb(255, 77, 255)','rgb(255, 0, 255)','rgb(179, 0, 179)']"
        :range-color="['#eeeeee', '#d6e685', '#8cc665', '#44a340', '#1e6823']" -->

      <!-- 
      :tooltip-formatter="(v: any) => v.count" -->

      <!-- 
        :locale="{
          less: '少',
          more: '多',
          on: '',
          days: ['周一', '', '', '周三', '', '', '周日'],
          months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }" -->

      <!-- '0个贡献' -->

      <!-- 通过设置font-size来调整里面的字体大小 -->
      <!-- 查看https://razorness.github.io/vue3-calendar-heatmap/ -->
      <div class="calender-heatmap">
        <calendar-heatmap
          :no-data-text="false"
          :values="[
            { date: '2022-7-12', count: 10 },
            { date: '2022-9-16', count: 10 },
            { date: '2022-9-21', count: 6 },
            { date: '2022-9-23', count: 6 }
          ]"
          :end-date="'2022-9-22'"
          :round="0"
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
        <div class="vch__tips">贡献度的统计数据包括代码提交、创建任务 / Pull Request、合并 Pull Request，其中代码提交的次数需本地配置的 git 邮箱是 Gitee 帐号已确认绑定的才会被统计。</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFormatTime } from '@/typings/date-time';
import { CalendarHeatmap } from 'vue3-calendar-heatmap'


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