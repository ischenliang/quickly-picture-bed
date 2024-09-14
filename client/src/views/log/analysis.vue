<template>
  <div class="analysis-dash">
    <el-row>
      <el-col :xl="6">
        <card-item :item="{
          total: 65333,
          today: 12,
          label: '图片数量',
          bgcolor: '#f0f9eb',
          cover: 'PictureFilled',
          color: '#67c23a',
          unit: ''
        }"></card-item>
      </el-col>
      <el-col :xl="6">
        <card-item :item="{
          total: 12,
          today: 1,
          label: '存储桶数量',
          bgcolor: '#ecf5ff',
          cover: 'Coffee',
          color: '#409eff',
          unit: ''
        }"></card-item>
      </el-col>
      <el-col :xl="6">
        <card-item :item="{
          total: 385796,
          today: 1,
          label: '占用总存储量',
          bgcolor: '#fdf6ec',
          cover: 'Box',
          color: '#e6a23c',
          unit: 'M'
        }"></card-item>
      </el-col>
      <el-col :xl="6">
        <card-item :item="{
          total: 6,
          today: 0,
          label: '相册数量',
          bgcolor: '#fef0f0',
          cover: 'CameraFilled',
          color: '#f56c6c',
          unit: ''
        }"></card-item>
      </el-col>
    </el-row>
    <div class="card-conttributes">
      <div class="conttributes-container">
        <div style="margin: 0 auto;text-align: center;margin-bottom: 15px;font-weight: bold;">系统贡献度</div>
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
    </div>
    <el-row>
      <el-col :xl="8">
        <div class="card-item" style="height: 400px;">存储桶情况</div>
      </el-col>
      <el-col :xl="8">
        <div class="card-item" style="height: 400px;">相册情况</div>
      </el-col>
      <el-col :xl="8">
        <div class="card-item" style="height: 400px;">近期动态</div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import Log from '@/types/Log';
import { useFormatTime } from '@/typings/date-time';
import moment from 'moment';
import { Ref, ref } from 'vue';
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import CardItem from '@/components/web/analysis/cardItem.vue'
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
.analysis-dash {
  .el-row {
    margin-bottom: 20px;
    .el-col {
      padding: 0 7.5px;
      // .card-item {
      //   width: 100%;
      //   height: 130px;
      //   background: #fff;
      //   border-radius: 4px;
      //   padding: 20px;
      //   display: flex;
      //   justify-content: space-between;
      //   align-items: center;
      //   .card-item-right {
      //     width: 70px;
      //     height: 70px;
      //     margin-left: 10px;
      //     flex-shrink: 0;
      //     background: #ccc;
      //   }
      //   .card-item-left {
      //     flex: 1;
      //     .card-item-count {
      //       margin-bottom: 10px;
      //       span:first-child {
      //         font-size: 30px;
      //       }
      //       span:last-child {
      //         font-size: 16px;
      //         color: rgb(102, 144, 249);
      //         margin-left: 5px;
      //       }
      //     }
      //     .card-item-label {
      //       color: #1d2129;
      //     }
      //   }
      // }
    }
  }
  .card-conttributes {
    width: 100%;
    padding: 0 7.5px;
    margin-bottom: 20px;
    .conttributes-container {
      width: 100%;
      background: #fff;
      padding: 15px 0;
    }
  }
}
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