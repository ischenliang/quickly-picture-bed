<template>
  <div class="gallery-container">
    <c-card :title="'图库'">
      <template #cardAction>
        <el-input
          v-model="list.filters.img_name"
          placeholder="请输入名称搜索"
          style="width: 180px;"
          :suffix-icon="'Search'"/>
      </template>
      <div class="gallery-filter">
        <div>
          <el-select v-model="list.filters.bucket_id" placeholder="请选择需要显示的图床" @change="listGet">
            <el-option
              v-for="(item, index) in buckets"
              :key="'bucket-' + index"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
        <div>
          <el-button type="primary" :icon="'Checked'" @click="handleToggleSelectAll">全选</el-button>
          <el-button
            :type="disabled ? 'default' : 'danger'"
            :icon="'Delete'"
            :disabled="disabled">删除所选</el-button>
        </div>
      </div>
      <div class="gallery-list">
        <el-row>
          <template v-for="(item, index) in list.data" :key="'gallery-item' + index">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <gallery-item
                :data="item"
                :images="list.data.map(item => item.img_preview_url)"
                @click.native="handleClick(index)"></gallery-item>
            </el-col>
          </template>
        </el-row>
      </div>
      <pagination
        :page="list.page"
        :size="list.size"
        :total="list.total"
        :page-sizes="[18, 36, 72, 100]"
        @change="listGet"/>
    </c-card>
  </div>
</template>

<script lang="ts" setup>
import { useCtxInstance } from '@/hooks/global';
import Bucket from '@/types/Bucket';
import Image from '@/types/Image';
import { BucketInter, ImageInter, ListInter } from '@/typings/interface';
import { BasicResponse } from '@/typings/req-res';
import { computed, reactive, Ref, ref, watch } from 'vue';
import GalleryItem from './gallery-item.vue'

/**
 * 实例
 */
const bucket = new Bucket()
const image = new Image()
const ctx = useCtxInstance()

/**
 * 变量
 */
// 列表数据
const list: ListInter<ImageInter> = reactive({
  page: 1,
  size: 18,
  total: 0,
  filters: {
    img_name: '',
    bucket_id: '', // 图床
    user_id: 0 // 全部
  },
  data: []
})
// 是否已全选
const selectAll = ref(false)
// 存储桶列表
const buckets: Ref<BucketInter[]> = ref([
  { name: '全部', id: '' }
])
// 用户组
const users = ref([
  { label: '全部', value: 0 }, // 管理员允许查看全部
  { label: '只看我的', value: 1 }
])
// 删除按钮是否启用
const disabled = computed(() => {
  return list.data.filter(item => item.checked).length === 0
})

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
    listGet()
  })
}
getBuckets()
// 获取图片列表
const listGet = () => {
  image.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: BasicResponse<ImageInter>) => {
    list.total = res.total
    list.data = res.data.map(item => {
      item.checked = false
      const bk = buckets.value.find(bu => bu.id === item.bucket_id)
      item.img_preview_url = bk ? bk.config_baseUrl + item.img_url : item.img_url
      return item
    })
  })
}

/**
 * 逻辑处理
 */
// 切换筛选条件
const toggleUser = (item) => {
  list.filters.user_id = item.value
}
// 全选
const handleToggleSelectAll = () => {
  selectAll.value = !selectAll.value
  list.data.forEach(item => {
    item.checked = selectAll.value
  })
}
// 点击
const handleClick = (index: number) => {
  // 参考：https://blog.csdn.net/Stephen_Joe/article/details/124815655
  ctx.$viewerApi({
    options: {
      initialViewIndex: index
    },
    images: list.data.map(item => item.img_preview_url)
  })
}

/**
 * 监听器
 */
// 监听list.data数据变化：当用户主动勾选图片时需要判断是否已经全勾选
watch(() => list.data, (val, old) => {
  const tmp = list.data.filter(item => item.checked)
  if (tmp.length === list.data.length) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
}, {
  deep: true,
  immediate: true
})

</script>

<style lang="scss">
@import '@/styles/global.scss';
@import '@/styles/flex-layout.scss';
.gallery-container {
  width: 100%;
  height: 100%;
  .el-card__header {
    padding: 12px 20px;
  }
  .el-card__body {
    overflow: auto;
    @include flex-layout(column);
  }
  .gallery-filter {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    flex-shrink: 0;
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
    flex: 1;
  }
}
</style>