<template>
  <div class="analysis-dash" v-loading="loading">
    <!-- 顶部banner -->
    <el-row>
      <el-col :xl="4" :lg="8" :md="12">
        <card-item :item="banners.image"></card-item>
      </el-col>
      <el-col :xl="4" :lg="8" :md="12">
        <card-item :item="banners.bucket"></card-item>
      </el-col>
      <el-col :xl="4" :lg="8" :md="12">
        <card-item :item="banners.album"></card-item>
      </el-col>
      <el-col :xl="4" :lg="8" :md="12">
        <card-item :item="banners.wiki"></card-item>
      </el-col>
      <el-col :xl="4" :lg="8" :md="12">
        <card-item :item="banners.article"></card-item>
      </el-col>
      <el-col :xl="4" :lg="8" :md="12">
        <card-item :item="banners.user"></card-item>
      </el-col>
    </el-row>
    <!-- 贡献度和动态 -->
    <el-row>
      <el-col :xl="12" :lg="12">
        <chart-item style="height: 400px;" :title="'用户增长图'">
          <recent-user :data="percentData.stats"></recent-user>
        </chart-item>
      </el-col>
      <el-col :xl="12" :lg="12">
        <chart-item style="height: 400px;" :title="'访问动态分布'">
          <map-chart></map-chart>
        </chart-item>
      </el-col>
    </el-row>
    <!-- 近一年内数据 -->
    <el-row>
      <el-col>
        <chart-item style="height: 400px;" :title="'近一年内数据统计'">
          <stats-recent :data="percentData.stats"></stats-recent>
        </chart-item>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import CardItem from '@/components/web/analysis/cardItem.vue'
import chartItem from '@/views/log/chart-item.vue'
import Log from '@/types/Log';
import { Ref, ref } from 'vue';
import StatsRecent from '@/views/log/components/recent-year.vue'
import RecentUser from '@/views/log/components/recent-user.vue'
import MapChart from '@/views/log/components/map-chart.vue'
interface Banner {
  image?: {
    total: number
    today: number
  }
  bucket?: {
    total: number
    today: number
  }
  album?: {
    total: number
    today: number
  }
  plugin?: {
    total: number
    today: number
  }
  wiki?: {
    total: number
    today: number
  }
  article?: {
    total: number
    today: number
  }
  user?: {
    total: number
    today: number
  }
}

interface BannerIten {
  total: number
  today: number
  label: string
  bgcolor: string
  cover: string
  color: string
  unit: string
}

/**
 * 实例
 */
const log = new Log()

/**
 * 变量
 */
const banner: Ref<Banner> = ref()
const banners: Ref<{ [prop: string]: BannerIten }> = ref({
  image: {
    total: 0,
    today: 0,
    label: '图片数量',
    bgcolor: '#f0f9eb',
    cover: 'PictureFilled',
    color: '#9ee974',
    unit: ''
  },
  bucket: {
    total: 0,
    today: 0,
    label: '存储桶数量',
    bgcolor: '#ecf5ff',
    cover: 'Coffee',
    color: '#6fb4fb',
    unit: ''
  },
  album: {
    total: 0,
    today: 0,
    label: '相册数量',
    bgcolor: '#fef0f0',
    cover: 'CameraFilled',
    color: '#f19797',
    unit: ''
  },
  user: {
    total: 0,
    today: 0,
    label: '用户数量',
    bgcolor: '#f8ebff',
    cover: 'User',
    color: '#c889e9',
    unit: ''
  },
  wiki: {
    total: 0,
    today: 0,
    label: '知识库数量',
    bgcolor: '#c9f2ff',
    cover: 'Collection',
    color: '#4bb7d9',
    unit: ''
  },
  article: {
    total: 0,
    today: 0,
    label: '文章数量',
    bgcolor: '#fdf6ec',
    cover: 'Document',
    color: '#fbcb87',
    unit: ''
  }
})
const percentData: Ref<any> = ref({})
const loading = ref(false)


/**
 * 数据获取 
 */
// 获取面板数据
function getBanner () {
  log.banner('admin').then((res: Banner) => {
    banner.value = res
    Object.keys(res).forEach(key => {
      if (banners.value[key]) {
        banners.value[key].today = res[key].today
        banners.value[key].total = res[key].total
      }
    })
  })
}
getBanner()
// 获取统计数据
function getPercentData () {
  loading.value = true
  log.percentData('admin').then((res: any) => {
    percentData.value = res
    console.log(res)
    loading.value = false
  })
}
getPercentData()
</script>

<style lang="scss">
.analysis-dash {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 10px 20px 10px;
  overflow: auto;
  .el-row {
    .el-col {
      padding: 7.5px;
    }
  }
  .contributes-row {
    .el-col {
      max-height: 290px;
      overflow: hidden;
    }
  }
}
</style>