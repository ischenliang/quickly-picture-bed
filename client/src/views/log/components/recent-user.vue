<template>
  <div id="recent-user" class="stats-chart"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, ref, watch } from 'vue';

/**
 * 实例
 */
const props = defineProps<{
  data: any
}>()

/**
 * 变量
 */
const myChart = ref()

/**
 * 逻辑处理
 */
function getLastYearMonth () {
  var today = new Date(); // 获取当前日期
  var months = []; // 存储最近 1 年内的所有月份

  // 循环获取每个月份
  for (var i = 0; i < 12; i++) {
    var year = today.getFullYear(); // 获取当前年份
    var month = today.getMonth() - i; // 获取当前月份并减去循环次数

    if (month < 0) { // 如果月份小于 0，则需要向前一年
      month += 12;
      year--;
    }

    // 格式化日期为 "YYYY-MM" 的字符串形式，并存储到数组中
    months.push(year + '-' + ('0' + (month + 1)).slice(-2));
  }
  return months.reverse()
}
function getYaxisData (data: { month: string; count: number }[], months: string[]) {
  return months.map(month => {
    const tmp = data.find(el => el.month === month)
    return tmp ? tmp.count : 0
  })
}

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  const el = document.getElementById('recent-user')
  myChart.value = echarts.init(el, 'westeros');
  // 绘制图表
  myChart.value.setOption({
    tooltip: {
      trigger: 'item'
    },
    grid: {
      bottom: 30,
      left: 50,
      right: 50
    },
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#777'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#777'
        }
      }
    }
  })

  const resizeObserver = new ResizeObserver((entries) => {
    myChart.value.resize()
  })
  if (el) {
    resizeObserver.observe(el)
  }
})

watch(() => props.data, (val: { [prop: string]: { month: string; count: number }[] }) => {
  if (val) {
    nextTick(() => {
      const { user } = val
      const months = getLastYearMonth()
      myChart.value.setOption({
        xAxis: {
          data: months
        },
        series: [
          {
            type: 'bar',
            name: '用户数量',
            data: getYaxisData(user, months)
          }
        ]
      })
    })
  }
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="scss">
.stats-chart {
  width: 100%;
  height: 100%;
}
</style>