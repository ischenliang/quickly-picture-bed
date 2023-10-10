<template>
  <div class="china-map">
    <div id="chart"></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { getProvinceMapInfo, name2pinyin } from "./util";
interface ChinaData {
  name: string;
  value: number;
}

/**
 * 变量
 */
const myChart: Ref<any> = ref();
// 所有省份的矢量地图数据：判断是否已经注册过地图
const mapData: Ref<{ [prop: string]: any }> = ref({});
// 散点数据
var data = [
  { name: "北京", value: 177 },
  { name: "四川", value: 102 },
  { name: "内蒙古", value: 47 },
  { name: "浙江", value: 114 },
  { name: "宁夏", value: 18 },
  { name: "新疆", value: 67 },
  { name: "广东", value: 123 },
  { name: "广西", value: 59 },
  { name: "海南", value: 14 },
];
var mapName = "china";

/**
 * 逻辑处理
 */
// 获取数据
function getData() {
  data = [
    { name: "北京", value: 177 },
    { name: "天津", value: 42 },
    { name: "河北", value: 102 },
    { name: "山西", value: 81 },
    { name: "内蒙古", value: 47 },
    { name: "辽宁", value: 67 },
    { name: "吉林", value: 82 },
    { name: "黑龙江", value: 66 },
    { name: "上海", value: 24 },
    { name: "江苏", value: 92 },
    { name: "浙江", value: 114 },
    { name: "安徽", value: 109 },
    { name: "福建", value: 116 },
    { name: "江西", value: 91 },
    { name: "山东", value: 119 },
    { name: "河南", value: 137 },
    { name: "湖北", value: 116 },
    { name: "湖南", value: 114 },
    { name: "重庆", value: 91 },
    { name: "四川", value: 125 },
    { name: "贵州", value: 62 },
    { name: "云南", value: 83 },
    { name: "西藏", value: 9 },
    { name: "陕西", value: 80 },
    { name: "甘肃", value: 56 },
    { name: "青海", value: 10 },
    { name: "宁夏", value: 18 },
    { name: "新疆", value: 67 },
    { name: "广东", value: 123 },
    { name: "广西", value: 59 },
    { name: "海南", value: 14 },
  ];
  updateChart();
}
// 更新地图
function updateChart() {
}
// 获取中国地图数据
async function getChinaMap() {
  const chinaMap = (await axios.get("/data/china.json")).data;
  chinaMap.features.forEach((el) => {
    // 地区名称
    var name = el.properties.name;
    // 地区经纬度
    geoCoordMap[name] = el.properties.cp;
  });
  return chinaMap;
}
// 数据转换: 将data转换成[经度，纬度，数据]
function convertData(data) {
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
}
async function initChart(el) {
  myChart.value = echarts.init(el);
  const chinaMap = await getChinaMap();
  console.log(chinaMap)
  console.log((await axios.get('/data/china2.json')).data)
  echarts.registerMap("china", chinaMap);
  myChart.value.showLoading()
  const option = {
    // 视觉映射: 就是将数据映射到视觉元素（视觉通道）
    visualMap: {
      show: true,
      min: 0,
      max: 200,
      left: "left",
      top: "bottom",
      text: ["高", "低"], // 文本，默认为数值文本
      // calculable: true, // 是否启用滑动条
      seriesIndex: [1],
      inRange: {
        color: ["#00467F", "#A5CC82"],
      },
    },
    geo: {
      show: true,
      map: mapName,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
        },
      },
      roam: true,
      // itemStyle: {
      //   normal: {
      //     areaColor: "#031525",
      //     borderColor: "#3B5077",
      //   },
      //   emphasis: {
      //     areaColor: "#2B91B7",
      //   },
      // },
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
    series: [
      // 生成地图上的散点：即各个省份的省会城市所在地
      {
        name: "散点",
        type: "scatter",
        coordinateSystem: "geo",
        data: convertData(data),
        symbolSize: (val) => {
          return val[2] / 10;
        },
        label: {
          normal: {
            formatter: "{b}",
            position: "right",
            show: true,
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: "#05C3F9",
          },
        },
        zlevel: 2
      },
      // 生成地图
      {
        type: "map",
        map: mapName,
        geoIndex: 0,
        aspectScale: 0.75, //长宽比
        showLegendSymbol: false, // 存在legend时显示
        label: {
          normal: {
            show: true,
          },
          emphasis: {
            show: false,
            textStyle: {
              color: "#fff",
            },
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: "#031525",
            borderColor: "#3B5077",
          },
          emphasis: {
            areaColor: "#2B91B7",
          },
        },
        animation: false,
        data: data
      },
      // 生成marker点
      {
        name: "点",
        type: "scatter",
        coordinateSystem: "geo",
        symbol: "pin",
        symbolSize: (val, params) => {
          const aMax = data.reduce((total, cur, index, arr) => {
            if (cur.value >= total) {
              total = cur.value
            }
            return total
          }, data[0].value)
          const maxPin = 40, minPin = 25
          const percent = parseFloat((aMax/maxPin).toPrecision(2))
          const scale = val[2] / percent
          return scale <= minPin ? minPin : scale
        },
        label: {
          show: true,
          fontSize: 11,
          formatter: (params) => {
            return params.data.value.pop()
          }
        },
        itemStyle: {
          normal: {
            color: "#F62157", //标志颜色
          },
        },
        zlevel: 6,
        data: convertData(data),
      },
      // 带有涟漪特效动画的散点
      {
        name: "Top 5",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: convertData(data.sort((a, b) => b.value - a.value).slice(0, 5)),
        symbolSize: function (val) {
          return val[2] / 10;
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: "{b}",
            position: "right",
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: "yellow",
            shadowBlur: 10,
            shadowColor: "yellow",
          },
        },
        zlevel: 4
      },
    ]
  };
  myChart.value.setOption(option);
  myChart.value.hideLoading()
}

const geoCoordMap = {};
/**
 * 监听器
 */
onMounted(async () => {
  const el = document.getElementById("chart")
  await initChart(el)
  // const resizeObserver = new ResizeObserver(async (entries) => {
  //   // myChart.value.dispose()
  //   // await initChart(el)
  //   myChart.value.resize()
  // })
  // if (el) {
  //   resizeObserver.observe(el)
  // }
});

window.addEventListener("resize", () => {
  myChart.value.resize();
});
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
