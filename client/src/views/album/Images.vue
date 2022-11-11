<template>
  <div class="album-images">
    <div class="album-image-header" :style="{
      'background-image': `url('${detail.background_preview}')`
    }">
      <div class="album-actions">
        <el-button type="primary" icon="Back" @click="() => $router.back()">返回</el-button>
        <el-button type="success" icon="UploadFilled" @click="() => $router.push({
          path: '/',
          query: {
            album_id: detail.id
          }
        })">去上传</el-button>
      </div>
      <div class="album-title">{{ detail.name }}</div>
      <div class="album-desc">{{ detail.desc }}</div>
      <div class="album-meta">
        <div class="album-meta-line">
          <span>
            <el-icon><Calendar /></el-icon>
            创建于 {{ detail.createdAt }}
          </span>
          <span class="divider">|</span>
          <span>
            <el-icon><RefreshLeft /></el-icon>
            更新于 {{ detail.updatedAt }}
          </span>
        </div>
        <div class="album-meta-line">
          <span>
            <el-icon><Picture /></el-icon>
            图片数量: {{list.total }}张
          </span>
        </div>
      </div>
    </div>
    <div class="album-image-content">
      <div class="album-image-list" v-loading="list.loading">
        <el-row v-if="list.data.length">
          <template v-for="(item, index) in list.data" :key="'gallery-item' + index">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <gallery-item
                :data="item"
                :remove="true"
                :images="list.data.map(item => item.img_preview_url)"
                @reload="listGet"
                @submit="handleItemSubmit"
                @click.native="handleClick(index)"></gallery-item>
            </el-col>
          </template>
        </el-row>
        <div class="empty-data" v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
      </div>
      <pagination
        v-model:page="list.page"
        v-model:size="list.size"
        :total="list.total"
        :page-sizes="[18, 36, 72, 100]"
        @change="listGet"/>
    </div>
    <!-- 图片弹窗 -->
    <detail-dialog
      v-if="item.detail"
      v-model="item.detail"
      :show-album="false"
      :detail="item.data"
      @submit="listGet"/>
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global';
import Album from '@/types/Album';
import Bucket from '@/types/Bucket';
import Image from '@/types/Image';
import { AlbumInter, BucketInter, ImageInter, ListInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { reactive, Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import DetailDialog from '@/views/gallery/DetailDialog.vue'
import GalleryItem from '@/views/gallery/gallery-item.vue'
import useConfigStore from '@/store/config';

/**
 * 实例
 */
const album = new Album()
const route = useRoute()
const image = new Image()
const bucket = new Bucket()
const ctx = useCtxInstance()
const configStore = useConfigStore()


/**
 * 变量
 */
// 相册
const detail: Ref<AlbumInter> = ref({})
// 列表数据
const list: ListInter<ImageInter> = reactive({
  page: 1,
  size: 18,
  total: 0,
  loading: false,
  filters: {
    album_id: route.query.id || ''
  },
  data: []
})
// 存储桶列表
const buckets: Ref<BucketInter[]> = ref([
  { name: '全部', id: '' }
])
const item = reactive({
  detail: false,
  data: null
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
  }).then((res: PageResponse<BucketInter>) => {
    list.total = res.total
    buckets.value = [
      { id: '', name: '全部' },
      ...res.items.map(item => {
        const obj = JSON.parse(item.config)
        const { baseUrl } = obj
        // const tmp = baseUrl && baseUrl.replace(/\$\{/g, '${obj.')
        // obj.baseUrl = eval('`' + tmp + '`')
        obj.baseUrl = baseUrl.replace(/\$\{(.*?)\}/g, (v, key) => {
          return obj[key]
        })
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
const getDetail = () => {
  const id = route.query.id as string
  if (id) {
    album.detail(id).then((res: AlbumInter) => {
      res.createdAt = useFormat(res.createdAt, 'YYYY-MM-DD')
      res.updatedAt = useFormat(res.updatedAt, 'YYYY-MM-DD')
      res.background_preview = configStore.systemConfig.website.baseUrl + res.background
      detail.value = res
    })
  }
}
getDetail()
// 获取图片列表
const listGet = () => {
  list.loading = true
  image.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<ImageInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.checked = false
      const bk = buckets.value.find(bu => bu.id === item.bucket_id)
      item.img_preview_url = bk ? bk.config_baseUrl + item.img_url : item.img_url
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
    list.loading = false
  })
}

/**
 * 回调函数
 */
// 点击
const handleClick = (index: number) => {
  ctx.$viewerApi({
    options: {
      initialViewIndex: index
    },
    images: list.data.map(item => item.img_preview_url)
  })
}
const handleItemSubmit = (e: { type: string, data: ImageInter }) => {
  switch (e.type) {
    case 'delete':
      useDeleteConfirm().then(() => {
        image.delete(e.data.id).then(res => {
          ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
          listGet()
        })
      })
      break
    case 'remove':
      useDeleteConfirm('确定将图片移出该相册吗？').then(() => {
        image.update({
          id: e.data.id,
          album_id: ''
        }).then(res => {
          ctx.$message({ message: '移除成功', type: 'success', duration: 1000 })
          listGet()
        })
      })
      break
    case 'detail':
      item[e.type] = true
      item.data = e.data
      break
  }
}
</script>

<style lang="scss">
.album-images {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .album-image-header {
    width: calc(100% + 19px + 19px);
    height: 250px;
    flex-shrink: 0;
    background-image: url('http://lc-DZNcsGI3.cn-n1.lcfile.com/Dy9tIIgJPRTmHbCGfUuc2k4p0BcDO3qE/202211081037249.jpg');
    background-size: 100% auto;
    background-position: center center;
    margin-top: -19px;
    margin-left: -19px;
    padding: 20px 3%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    color: #fff;
    .album-actions {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 20px;
    }
    .album-title {
      font-size: 28px;
      margin-bottom: 0.2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .album-desc {
      font-size: 18px;
      margin-bottom: 0.2rem;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      display: -webkit-box;
    }
    .album-meta-line {
      line-height: 2;
      font-size: 16px;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        .el-icon {
          margin-right: 5px;
        }
        &.divider {
          width: 1px;
          margin: 0 10px;
        }
      }
    }
  }
  .album-image-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .album-image-list {
      flex: 1;
      padding-top: 10px;
      .el-row {
        width: 100%;
        height: 100%;
        align-content: flex-start;
      }
      .el-col {
        padding: 10px;
      }
    }
  }
  .empty-data {
    width: 100%;
    height: 100%;
    .el-empty {
      width: 100%;
      height: 100%;
    }
  }
}
</style>