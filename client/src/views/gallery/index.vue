<template>
  <div class="gallery-container">
    <c-card :title="'图库'">
      <template #cardAction>
        <el-input
          v-model="list.filters.search"
          placeholder="请输入搜索内容..."
          style="width: 180px;"
          :suffix-icon="'Search'"
          clearable
          @input="handleInput"/>
      </template>
      <div class="gallery-filter">
        <!-- 筛选 -->
        <div>
          <el-select v-model="list.filters.bucket_id" placeholder="请选择需要显示的图床" filterable @change="listGet">
            <el-option
              v-for="(item, index) in buckets"
              :key="'bucket-' + index"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
        <!-- 操作 -->
        <div>
          <el-button type="warning" v-if="selected.length === 1" @click="handleRename">重命名</el-button>
          <!-- 这里采用一个下拉框的方式来提供选择的链接格式类型 -->
          <template v-if="selected.length">
            <el-dropdown class="copy-link-type" trigger="click" @command="(func) => func()">
              <el-button type="primary" icon="DocumentCopy">复制链接</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(link, index) in linkTypes"
                    :key="index"
                    :label="link.label"
                    :value="link.id"
                    :command="() => handleCommond(link)">
                    {{ link.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary" :icon="'Position'" @click="handleMoveAlbum">移入相册</el-button>
          </template>
          <el-button type="primary" :icon="'Checked'" @click="handleToggleSelectAll">全选</el-button>
          <el-button
            :type="disabled ? 'default' : 'danger'"
            :icon="'Delete'"
            :disabled="disabled"
            @click="deleteAll">
            删除所选
          </el-button>
          <el-button @click="toggleDrag">{{ editable ? '完成排序' : '启用排序' }}</el-button>
        </div>
      </div>
      <div class="gallery-list" v-loading="list.loading">
        <el-row v-if="list.data.length" id="sortableRef">
          <el-col
            v-for="(item, index) in list.data"
            :key="'gallery-item-' + index + '-' + item.id"
            :xl="4"
            :lg="6"
            :md="8"
            :sm="12"
            :xs="24"
            class="drag-box-col">
            <gallery-item
              :data="item"
              :key="item.id"
              :editable="editable"
              :images="list.data.map(item => item.preview_url)"
              @reload="listGet"
              @submit="handleItemSubmit"
              @view="handleClick(index)">
            </gallery-item>
          </el-col>
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
    </c-card>
    <!-- 需放进来：放在和gallery-item同级会导致点击时无效果 -->
    <detail-dialog
      v-if="item.detail"
      :model-value="item.detail"
      :show-album="!false"
      :id="item.data.id"
      @submit="listGet"
      @update:model-value="(val) => item.detail = val"/>
    <album-dialog
      v-if="selected.length && item.move"
      :model-value="item.move"
      :ids="selected.map(el => el.id)"
      @submit="listGet"
      @update:model-value="(val) => item.move = val"/>
  </div>
</template>

<script lang="ts" setup>
import { useCopyText, useCtxInstance, useDeleteConfirm, useDragSort, useListFilter } from '@/hooks/global';
import Bucket from '@/types/Bucket';
import Image from '@/types/Image';
import { BucketInter, ImageInter, ListInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { computed, nextTick, onActivated, reactive, Ref, ref, watch } from 'vue';
import GalleryItem from './gallery-item.vue'
import { useFormat } from '@/hooks/date-time';
import DetailDialog from './DetailDialog.vue'
import AlbumDialog from './AlbumDialog.vue'
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { linkTypes } from '@/global.config';

/**
 * 实例
 */
const bucket = new Bucket()
const image = new Image()
const ctx = useCtxInstance()
const route = useRoute()
const router = useRouter()
const editable = ref(false)

/**
 * 变量
 */
// 列表数据
const list: ListInter<ImageInter> = reactive({
  page: 1,
  size: 18,
  total: 0,
  loading: false,
  filters: {
    search: '',
    bucket_id: 0, // 图床
    user_id: 0, // 全部
  },
  data: []
})
// 已勾选数据
const selected: Ref<ImageInter[]> = computed(() => {
  return list.data.filter(el => el.checked)
})
// 是否已全选
const selectAll = ref(false)
// 存储桶列表
const buckets: Ref<BucketInter[]> = ref([
  { name: '全部', id: 0 }
])
// 删除按钮是否启用
const disabled = computed(() => {
  return list.data.filter(item => item.checked).length === 0
})
const item = reactive({
  detail: false,
  move: false,
  data: null
})

/**
 * 数据获取
 */
// 获取存储桶列表
const getBuckets = () => {
  list.loading = true
  bucket.find({}).then((res: PageResponse<BucketInter>) => {
    buckets.value = [
    { id: 0, name: '全部' },
      ...res.items.map(el => el)
    ]
    listGet()
  })
}
// 获取图片列表
const listGet = () => {
  image.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<ImageInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.preview_url = item.baseurl + item.url
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
    list.loading = false
  })
}

/**
 * 逻辑处理
 */
// 重命名
function handleRename () {
  const tmp = list.data.filter(el => el.checked)[0]
  ElMessageBox.prompt('请输入新的文件名', '文件重命名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^(?!\s*$).+/,
    inputErrorMessage: '请输入新的文件名，文件名不符合标准',
    inputType: 'textarea',
    inputPlaceholder: '请输入新文件名',
    inputValue: tmp.origin_name
  }).then(({ value }) => {
    image.update({
      id: tmp.id,
      origin_name: value
    }).then(res => {
      ctx.$message({ message: '重命名成功', duration: 1000, type: 'success' })
      listGet()
    })
  }).catch(() => {})
}
// 全选
const handleToggleSelectAll = () => {
  selectAll.value = !selectAll.value
  list.data.forEach(item => {
    item.checked = selectAll.value
  })
}
// 复制已选的图片链接
function handleCommond (link: any) {
  const copyText = selected.value.map(item => {
    const obj = { url: item.preview_url, filename: item.name }
    return link.value.replace(/\$\{(.*?)\}/g, (v, key) => {
      return obj[key]
    })
  }).join('\n')
  useCopyText(ctx, copyText)
}
// 点击预览
const handleClick = (index: number) => {
  // 参考：https://blog.csdn.net/Stephen_Joe/article/details/124815655
  ctx.$viewerApi({
    options: {
      initialViewIndex: index
    },
    images: list.data.map(item => item.preview_url)
  })
}
// image-item按钮点击回调
const handleItemSubmit = (e: { type: string, data: ImageInter }) => {
  switch (e.type) {
    case 'delete':
      useDeleteConfirm('确定删除吗?(由于对象存储几乎不要钱，故此处只是删除本条记录，不会删除对象存储上的原数据，所以删除后仍然能正常访问)').then(() => {
        image.delete(e.data.id).then(res => {
          ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
          listGet()
        })
      })
      break
    case 'detail':
      item[e.type] = true
      item.data = e.data
      break
    case 'update':
      useListFilter(list, route.name, 'set')
      router.push({
        path: '/',
        query: {
          img_id: e.data.id
        }
      })
      break 
  }
}
// 删除所有
const deleteAll = () => {
  const ids = list.data.filter(item => item.checked).map(item => item.id)
  useDeleteConfirm('确定删除吗?(由于对象存储几乎不要钱，故此处只是删除记录，不会删除对象存储上的原数据，所以删除后仍然能正常访问)').then(() => {
    ids.map((id, index) => {
      image.delete(id).then(res => {
        if (index === ids.length - 1) {
          ctx.$message({ message: '删除成功', duration: 1000, type: 'success' })
          listGet()
        }
      })
    })
  })
}
// 移入相册
function handleMoveAlbum () {
  item.move = true
}
// 搜索
const handleInput = (val) => {
  setTimeout(() => {
    listGet()
  }, 1000)
}

function toggleDrag () {
  editable.value = !editable.value
  initDrag()
}
function initDrag () {
  nextTick(() => {
    useDragSort(document.querySelector('#sortableRef'), list.data, dragSort)
  })
}
// 切换顺序
function dragSort (fromIndex: number, toIndex: number) {
  const [from, to] = [list.data[fromIndex], list.data[toIndex]]
  // const [fromWeight, toWeight] = [from.weight, to.weight]
  // from.weight = toWeight
  // to.weight = fromWeight
  // list.data.splice(fromIndex, 1, to)
  // list.data.splice(toIndex, 1, from)
  // console.log(fromIndex, from.id, from.name)
  // console.log(toIndex, to.id, to.name)
  // initDrag()
  
  list.loading = true
  image.sort(from.id, to.id).then(() => {
    listGet()
    // initDrag()
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


// 激活页
onActivated(() => {
  useListFilter(list, route.name, 'get', getBuckets)
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
    padding: 20px 20px 10px;
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
      width: 180px;
    }
  }
  .el-col {
    padding: 10px;
  }
  .gallery-list {
    margin-top: 5px;
    flex: 1;
  }
  .empty-data {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .copy-link-type {
    margin: 0 10px;
  }
}
</style>