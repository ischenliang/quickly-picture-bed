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
        <card-item :item="banners.plugin"></card-item>
      </el-col>
    </el-row>
    <!-- 贡献度和动态 -->
    <el-row class="contributes-row">
      <el-col :xl="16" :lg="16">
        <contribute-item></contribute-item>
      </el-col>
      <el-col :xl="8" :lg="8">
        <recent-log></recent-log>
      </el-col>
    </el-row>
    <!-- 数据占比 -->
    <el-row>
      <el-col :xl="6" :lg="12">
        <!-- 存储桶情况(每个存储桶图片数量统计) -->
        <chart-item :title="'存储桶图片占比'" :unit="'张'">
          <pie-chart :serie-name="'图片数量'" :data="percentData.bucket_image" :index="1"></pie-chart>
        </chart-item>
      </el-col>
      <el-col :xl="6" :lg="12">
        <!-- 相册情况(每个相册图片数量统计) -->
        <chart-item :title="'相册图片占比'" :unit="'张'">
          <pie-chart :serie-name="'图片数量'" :data="percentData.album_image" :index="2"></pie-chart>
        </chart-item>
      </el-col>
      <el-col :xl="6" :lg="12">
        <!-- 占用内存情况(每个存储桶数据占用情况) -->
        <chart-item :title="'存储桶容量占比'" :unit="'M'">
          <pie-chart :serie-name="'占用存储大小'" :data="percentData.bucket_storage" :index="3"></pie-chart>
        </chart-item>
      </el-col>
      <el-col :xl="6" :lg="12">
        <!-- 每个知识库中文章的数量 -->
        <chart-item :title="'知识库文章占比'" :unit="'篇'">
          <pie-chart :serie-name="'文章数量'" :data="percentData.wiki_article" :index="4"></pie-chart>
        </chart-item>
      </el-col>
    </el-row>
    <!-- 近一年内数据 -->
    <el-row>
      <el-col>
        <!-- 一年内的所有数据增长情况(按月统计) -->
        <chart-item style="height: 400px;" :title="'近一年内数据统计'">
          <stats-recent :data="percentData.stats"></stats-recent>
        </chart-item>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import CardItem from '@/components/web/analysis/cardItem.vue'
import chartItem from './chart-item.vue'
import recentLog from './recent-log.vue'
import contributeItem from './contribute-item.vue';
import Log from '@/types/Log';
import { Ref, ref } from 'vue';
import StatsRecent from './components/recent-year.vue'
import pieChart from './components/pie-chart.vue';
interface Banner {
  image: {
    total: number
    today: number
  }
  bucket: {
    total: number
    today: number
  }
  album: {
    total: number
    today: number
  }
  plugin: {
    total: number
    today: number
  }
  wiki: {
    total: number
    today: number
  }
  article: {
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
  plugin: {
    total: 0,
    today: 0,
    label: '插件安装数量',
    bgcolor: '#f8ebff',
    cover: 'WalletFilled',
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
  log.banner().then((res: Banner) => {
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
  log.percentData().then((res: any) => {
    percentData.value = res
    percentData.value.bucket_image = res.bucket_image.map(el => {
      return {
        name: el.bucket_name,
        value: el.count
      }
    })
    percentData.value.album_image = res.album_image.map(el => {
      return {
        name: el.album_name,
        value: el.count
      }
    })
    percentData.value.wiki_article = res.wiki_article.map(el => {
      return {
        name: el.wiki_name,
        value: el.count
      }
    })
    percentData.value.bucket_storage = res.bucket_storage.map(el => {
      return {
        name: el.bucket_name,
        value: ((el.count || 0) / (1024 * 1024)).toFixed(2)
      }
    })
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