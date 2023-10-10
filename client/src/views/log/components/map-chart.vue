<template>
  <div class="china-map">
    <div id="chart"></div>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref, type Ref } from 'vue'

interface ChinaData {
  name: string
  value: number
}

/**
 * 变量
 */
// @ts-ignore
const echarts = window.echarts
const myChart: Ref<any> = ref()
var mapName = "china";
var geoCoordMap: any = {};
var data: Ref<ChinaData[]> = ref([])


/**
 * 逻辑处理
 */
// 转换数据
function convertData (data: any) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      });
    }
  }
  return res;
};

/**
 * 监听器
 */
onMounted(async () => {
  data.value = [
    { "name": "四川", "value": 14 },
    { "name": "重庆", "value": 10 },
    { "name": "广东", "value": 12 },
    { "name": "浙江", "value": 9 },
    { "name": "江苏", "value": 3 },
    { "name": "新疆", "value": 4 },
    { "name": "西藏", "value": 2 },
    { "name": "山东", "value": 1 },
    { "name": "吉林", "value": 2 },
    { "name": "江西", "value": 2 },
    { "name": "黑龙江", "value": 1 },
    { "name": "宁夏", "value": 1 },
    { "name": "山西", "value": 1 },
    { "name": "青海", "value": 2 }
  ]
  myChart.value = echarts.init(document.getElementById("chart"));
  myChart.value.showLoading();
  var mapFeatures = echarts.getMap(mapName).geoJson.features;
  myChart.value.hideLoading();
  mapFeatures.forEach((v: any) => {
    // 地区名称
    var name = v.properties.name;
    // 地区经纬度
    geoCoordMap[name] = v.properties.cp;
  });
  var option = {
    tooltip: {
      // padding: 0,
      enterable: true,
      transitionDuration: 1,
      label: {
        color: "#fff",
        decoration: "none",
      },
      formatter: (params: any) => {
        const current = data.value.find(el => el.name === params.name)
        if (current && current.value) {
          return `<div>
          <p style="font-size: 16px;font-weight: bold;">${params.name}</p>
          <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span>
          <span>${current ? current.value : 0}</span> 
        </div>`
        } else {
          return ''
        }
      },
    },
    // 视觉映射: 就是将数据映射到视觉元素（视觉通道）
    visualMap: {
      show: false,
      min: 0,
      max: 200,
      left: "10%",
      top: "bottom",
      calculable: true,
      seriesIndex: [1],
      inRange: {
        color: ["#04387b", "#467bc0"], // 蓝绿
      },
    },
    // 地理坐标系组件
    geo: {
      map: mapName,
      label: {
        show: true,
        color: "#333841",
        textShadowColor: '#fff',
        textShadowBlur: 2,
        // shadowColor: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        position: 'left'
      },
      // 设置后可以缩放地图
      roam: true,
      zoom: 1.21,
      itemStyle: {
        normal: {
          areaColor: "#0031A8",
          borderColor: "#1180c7",
        },
        emphasis: {
          itemStyle: {
            areaColor: "#ffd917",
          }
        }
      }
    },
    // 数据集
    series: [
      // 生成的渲染，可以实现多颜色块地图
      {
        name: "散点",
        type: "scatter",
        coordinateSystem: "geo",
        data: convertData(data.value),
        // 标记大小
        symbolSize: 0,
      },
      // 地图上映射具体的数据
      {
        type: "map",
        map: mapName,
        geoIndex: 0,
        // showLegendSymbol: false, // 存在legend时显示
        label: {
          show: true,
        },
        roam: true,
        itemStyle: {
          areaColor: "#031525",
          borderColor: "#3B5077",
        },
        animation: false,
        data: data,
        emphasis: {
          label: {
            show: false,
            color: "#fff",
          },
          itemStyle: {
            areaColor: "#2B91B7",
          },
        },
      },
      // 排名前五的高亮效果
      {
        name: "省份数据",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: convertData(data.value.sort((a: ChinaData, b: ChinaData) =>  {
          return b.value - a.value;
        })),
        symbolSize: (val: any) => {
          return 10;
        },
        showEffectOn: "render",
        rippleEffect: {
          scale: 5,
          brushType: "stroke",
        },
        label: {
          formatter: "{b}",
          position: "left",
          show: false,
        },
        itemStyle: {
          color: "yellow",
          shadowBlur: 5,
          shadowColor: "yellow",
        },
        zlevel: 1,
      },
    ],
  };
  myChart.value.setOption(option)
})

window.addEventListener('resize', () => {
  myChart.value.resize()
})
</script>
<style lang="scss">
.china-map {
  width: 100%;
  height: 100%;
  #chart {
    width: 100%;
    height: 100%;
  }
}
</style>
