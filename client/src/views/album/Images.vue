<template>
  <div class="album-images">
    <div class="album-image-header" :style="{
      'background-image': `url('${detail.background_preview}')`
    }">
      <div class="album-actions">
        <el-button type="primary" icon="Back" @click="() => $router.back()">返回</el-button>
        <el-button type="success" icon="UploadFilled" @click="goUpload">去上传</el-button>
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
      <div class="album-image-filter">
        <div class="filter-input">
          <el-input v-model="list.filters.img_name" size="large" placeholder="请输入搜索内容..." clearable @keyup.enter="listGet" @clear="listGet">
            <template #append>
              <el-button type="primary" @click="() => { list.page = 1;listGet(); }">
                <el-icon><Search/></el-icon>&nbsp;搜索
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="filter-tags" v-if="tags.length >= 2">
          <span>标签搜索:</span>
          <span
            v-for="(tag, index) in tags"
            :key="'filter-tag-' + index"
            :class="['filter-tag-item', tag === list.filters.tag ? 'active' : '']"
            @click="changeTag(tag)">{{ tag }}</span>
        </div>
      </div>
      <div class="album-image-list" v-loading="list.loading">
        <el-row v-if="list.data.length">
          <template v-for="(item, index) in list.data" :key="'gallery-item' + index">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <gallery-item
                :data="item"
                :remove="true"
                :images="list.data.map(item => item.img_preview_url)"
                @reload="listGet"
                :key="list.page + '-' + index"
                @submit="handleItemSubmit"
                @click.native="handleClick(index)">
                <template #tags>
                  <div class="album-tags">
                    <el-tag
                      size="small"
                      v-for="(tag, tIndex) in item.tags"
                      :key="'tag-' + tIndex"
                      :type="getTagType(tag)">
                      {{ tag }}
                    </el-tag>
                    <el-tag class="tags-edit" size="small" effect="dark" type="primary" @click.stop="editItemTag(item)">
                      <el-icon><Edit /></el-icon>
                    </el-tag>
                  </div>
                </template>
              </gallery-item>
            </el-col>
          </template>
        </el-row>
        <div class="empty-data" v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
      </div>
      <pagination
        :key="list.page"
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
    <!-- 标签编辑 -->
    <tag-dialog
      v-if="item.edit"
      v-model="item.edit"
      :detail="item.data"
      @submit="() => { getTags();listGet(); }" />
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCtxInstance, useDeleteConfirm, useListFilter } from '@/hooks/global';
import Album from '@/types/Album';
import Bucket from '@/types/Bucket';
import Image from '@/types/Image';
import { AlbumInter, BucketInter, ImageInter, ListInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { nextTick, onActivated, reactive, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailDialog from '@/views/gallery/DetailDialog.vue'
import TagDialog from './TagDialog.vue'
import GalleryItem from '@/views/gallery/gallery-item.vue'
import useConfigStore from '@/store/config';

/**
 * 实例
 */
const album = new Album()
const route = useRoute()
const router = useRouter()
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
    album_id: route.query.id || '',
    tag: '全部',
    img_name: ''
  },
  data: []
})
// 存储桶列表
const buckets: Ref<BucketInter[]> = ref([
  { name: '全部', id: '' }
])
const item = reactive({
  detail: false,
  data: null,
  edit: false
})
// 置顶数量
const tops = ref(0)
// 所有标签
const tags = ref(['全部'])

/**
 * 数据获取
 */
// 获取存储桶列表
const getBuckets = () => {
  bucket.find({
    ...list.filters
  }).then((res: PageResponse<BucketInter>) => {
    // 这个影响了分页的初始状态，切记切记切记......(排查了很久才发现是这里导致的问题)
    // list.total = res.total
    buckets.value = [
      { id: '', name: '全部' },
      ...res.items.map(item => {
        const obj = JSON.parse(item.config)
        // const { baseUrl } = obj
        // 第一版本
        // const tmp = baseUrl && baseUrl.replace(/\$\{/g, '${obj.')
        // obj.baseUrl = eval('`' + tmp + '`')
        // obj.baseUrl = baseUrl && baseUrl.replace(/\$\{(.*?)\}/g, (v, key) => {
        //   return obj[key]
        // })
        
        // 第二版本
        // obj.baseUrl = baseUrl && baseUrl.replace(/\$\{((config).*?)\}/g, (v, key) => {
        //   const keys = key.split('.')
        //   if (keys[0] === 'config') {
        //     return obj[keys[1]]
        //   }
        // })

        // 第三版本
        for (let key in obj) {
          obj[key] = obj[key].replace(/\$\{((config).*?)\}/g, (v, key) => {
            const keys = key.split('.')
            if (keys[0] === 'config') {
              return obj[keys[1]]
            }
          })
        }
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
// 获取标签列表
const getTags = (callback: Function = () => {}) => {
  album.tags(route.query.id as string).then((res: string[]) => {
    tags.value = [
      '全部',
      ...res
    ]
    if (!tags.value.includes(list.filters.tag)) {
      list.filters.tag = '全部'
      callback()
    }
  })
}
getTags()
// 相册详情获取
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
  tops.value = 0
  album.images({
    page: list.page,
    size: list.size,
    id: list.filters.album_id,
    name: list.filters.img_name,
    tag: list.filters.tag === '全部' ? '' : list.filters.tag
  }).then((res: PageResponse<ImageInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.checked = false
      const bk = buckets.value.find(bu => bu.id === item.bucket_id)
      item.img_preview_url = bk ? bk.config_baseUrl + item.img_url : item.img_url
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      // item.top = item.sort === 0 ? false : true
      if (item.sort > 0) {
        if (tops.value < item.sort) {
          tops.value = item.sort
        }
      }
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
      useDeleteConfirm('确定删除吗?(由于对象存储几乎不要钱，故此处只是删除本条记录，不会删除对象存储上的原数据，所以删除后仍然能正常访问)').then(() => {
        image.delete(e.data.id).then(res => {
          ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
          getTags(listGet)
        })
      })
      break
    case 'remove':
      useDeleteConfirm('确定将图片移出该相册吗？').then(() => {
        image.update({
          id: e.data.id,
          album_id: '',
          sort: 0,
          slient: true
        }).then(async (res) => {
          ctx.$message({ message: '移除成功', type: 'success', duration: 1000 })
          listGet()
        })
      })
      break
    case 'detail':
      item[e.type] = true
      item.data = e.data
      break
    case 'top':
      image.update({
        id: e.data.id,
        slient: true,
        sort: tops.value + 1
      }).then(res => {
        listGet()
      })
      break
    case 'unTop':
      image.update({
        id: e.data.id,
        slient: true,
        sort: 0
      }).then(res => {
        listGet()
      })
      break
    case 'update':
      useListFilter(list, route.name, 'set')
      router.push({
        path: '/',
        query: {
          album_id: detail.value.id,
          img_id: e.data.id
        }
      })
      break    
  }
}
// 更新图片的标签
const editItemTag = (data: ImageInter) => {
  item.edit = true
  item.data = data
}
// 根据tag名称渲染类别
const getTagType = (tag) => {
  if (tag === '已完结') {
    return 'danger'
  }
  if (tag === '连载') {
    return 'success'
  }
  return 'default'
}
// 切换标签
const changeTag = (tag) => {
  list.filters.tag = tag
  listGet()
}
// 去上传
const goUpload = () => {
  useListFilter(list, route.name, 'set')
  router.push({
    path: '/',
    query: {
      album_id: detail.value.id
    }
  })
}


// 激活页
onActivated(() => {
  useListFilter(list, route.name, 'get', getBuckets)
})
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
    .album-image-filter {
      flex-shrink: 0;
      margin: 30px 0 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .filter-input {
        width: 748px;
        .el-input__wrapper {
          box-shadow: 0 0 0 1px #409eff inset;
        }
        .el-input-group__append {
          background: #409eff;
          box-shadow: none;
          border: 1px solid #409eff;
          border-left: none;
          color: #fff;
        }
      }
      .filter-tags {
        width: 748px;
        font-size: 14px;
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        color: rgba($color: #000000, $alpha: 0.65);
        span:first-child {
          margin-right: 5px;
        }
        .filter-tag-item {
          padding: 0 8px;
          cursor: pointer;
          margin-bottom: 8px;
          &.active {
            background: #409eff;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            padding: 2px 5px;
          }
        }
      }
    }
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
      .album-tags {
        position: absolute;
        left: 5px;
        bottom: 0;
        width: 100%;
        z-index: 3;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .el-tag {
          margin-bottom: 5px;
          + .el-tag {
            margin-left: 5px;
          }
        }
        .tags-edit {
          display: none;
        }
      }
      .gallery-item:hover {
        .tags-edit {
          display: inline-flex;
        }
      }
    }
    .pagination {
      margin: 5px 0 10px;
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