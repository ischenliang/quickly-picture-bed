<template>
  <div class="gallery-container">
    <c-card :title="'图库'">
      <template #cardAction>
        <el-input
          v-model="list.filters.name"
          placeholder="请输入名称搜索"
          style="width: 180px;"
          :suffix-icon="'Search'"/>
      </template>
      <div class="gallery-filter">
        <div>
          <!-- 由于图片关联了存储桶，而每张图片都需要存储桶中的baseUrl来预览，如果查看所有人的会导致操作起来复杂 -->
          <!-- <el-button-group>
            <el-button
              v-for="(item, index) in users"
              :key="'el-button-' + index"
              :type="list.filters.user_id === item.value ? 'primary' : 'default'"
              @click="toggleUser(item)">
              {{ item.label }}
            </el-button>
          </el-button-group> -->
          <el-select v-model="list.filters.bucket_id" placeholder="请选择需要显示的图床">
            <el-option
              v-for="(item, index) in buckets"
              :key="'bucket-' + index"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
        <div>
          <!-- Checked、CircleCheck -->
          <el-button type="primary" :icon="'Checked'">全选</el-button>
          <el-button type="danger" :icon="'Delete'">删除所选</el-button>
        </div>
      </div>
      <div class="gallery-list">
        <el-row>
          <template v-for="(item, index) in list.data" :key="'gallery-item' + index">
            <el-col :xl="4">
              <gallery-item :data="item"></gallery-item>
            </el-col>
          </template>
        </el-row>
      </div>
      <pagination :page-sizes="[18, 36, 72, 100]"></pagination>
    </c-card>
  </div>
</template>

<script lang="ts" setup>
import Bucket from '@/types/Bucket';
import { BucketInter, ListInter } from '@/typings/interface';
import { BasicResponse } from '@/typings/req-res';
import { reactive, Ref, ref } from 'vue';
import GalleryItem from './gallery-item.vue'

/**
 * 实例
 */
const bucket = new Bucket()

/**
 * 变量
 */
// 列表数据
const list: ListInter<{ url: string, name: string, checked: boolean }> = reactive({
  page: 1,
  size: 10,
  total: 0,
  filters: {
    name: '',
    bucket_id: '', // 图床
    user_id: 0 // 全部
  },
  data: [
    { url: 'http://imgs.itchenliang.club/img/202208151504485.png', name: '202208151504485.png', checked: true },
    { url: 'http://imgs.itchenliang.club/img/202209200933828.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151502049.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151358855.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false },
    { url: 'http://imgs.itchenliang.club/img/202208151357329.png', name: '202209200933828.png', checked: false }
  ]
})
// 存储桶列表
const buckets: Ref<BucketInter[]> = ref([
  { name: '全部', id: '' }
])
// 用户组
const users = ref([
  { label: '全部', value: 0 }, // 管理员允许查看全部
  { label: '只看我的', value: 1 }
])

/**
 * 数据获取
 */
// 获取存储桶列表
const getBuckets = () => {
  bucket.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: BasicResponse<BucketInter>) => {
    list.total = res.total
    buckets.value = [
    { id: '', name: '全部' },
      ...res.data.map(item => {
        const obj = JSON.parse(item.config)
        /**
         * 将baseUrl中的占位符全局替换
         *  为了避免不同存储桶的配置不同占位符也就不同带来的困扰，我们需要进行如下几步
         *    1-1: 需要将baseUrl中的占位符全局替换成 obj.，例如${username} ==> ${obj.name}
         *    1-2: 然后使用eval的方式来将${obj.xxx}替换成真实的数据
         *       技巧：使用eval拼接出模板字符串格式，然后替换，则不需要花费更多的操作
         *  注意：
         *    eval需要捕获异常，避免 ${test} 使用eval转成模板字符串最后换成真实数据过程中，由于全局中并没有 test 变量而带来的错误 
         *      错误：ReferenceError: test is not defined
         *    在此处使用的方法中即${obj.test}不会报错，因为我们的obj是引用类型，查找不到该属性时会直接返回undefined
         */
        const { baseUrl } = obj
        const tmp = baseUrl && baseUrl.replace(/\$\{/g, '${obj.')
        obj.baseUrl = eval('`' + tmp + '`')
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          tag: item.tag,
          config_baseUrl: obj.baseUrl
        }
      })
    ]
  })
}
getBuckets()

/**
 * 逻辑处理
 */
// 切换筛选条件
const toggleUser = (item) => {
  list.filters.user_id = item.value
}
</script>

<style lang="scss">
@import '@/styles/global.scss';
.gallery-container {
  width: 100%;
  height: 100%;
  .el-card__header {
    padding: 12px 20px;
  }
  .el-card__body {
    overflow: auto;
  }
  .gallery-filter {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    .el-button-group {
      margin-right: 12px;
    }
    .el-select {
      width: 150px;
    }
  }
  .el-col {
    padding: 10px;
  }
  .gallery-list {
    margin-top: 5px;
  }
}
</style>