<template>
  <div :id="'bucket-image-' + index" class="stats-chart"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, nextTick, ref, watch } from 'vue';

/**
 * 实例
 */
const props = defineProps<{
  data: {
    name: string
    value: number
  }[]
  index: number | string
  serieName: string
}>()

/**
 * 变量
 */
const myChart = ref()

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  const el = document.getElementById('bucket-image-' + props.index)
  myChart.value = echarts.init(el, 'westeros');
  // 绘制图表
  myChart.value.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: props.serieName,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: []
      }
    ]
  })

  const resizeObserver = new ResizeObserver((entries) => {
    myChart.value.resize()
  })
  if (el) {
    resizeObserver.observe(el)
  }
})

watch(() => props.data, (val) => {
  if (val && val.length) {
    nextTick(() => {
      myChart.value.setOption({
        series: {
          data: val
        }
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