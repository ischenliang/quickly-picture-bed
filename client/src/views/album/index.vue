<template>
  <div class="album-container">
    <c-card :title="'我的相册(' + list.total + ')'">
      <template #cardAction>
        <el-input
          v-model="list.filters.search"
          placeholder="请输入搜索内容..."
          style="width: 180px;"
          :suffix-icon="'Search'"
          clearable
          @input="handleInput"/>
      </template>
      <div class="album-filter">
        <div>
          <el-select v-model="list.filters.access_type" placeholder="请选择相册类别" filterable @change="listGet">
            <el-option
              v-for="(item, index) in types"
              :key="'bucket-' + index"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
        <div>
          <el-button type="primary" @click="itemOperate(null, 'edit')">新增</el-button>
          <el-button v-if="list.data.length" @click="toggleDrag">{{ editable ? '完成排序' : '启用排序' }}</el-button>
        </div>
      </div>
      <div class="album-list" v-loading="list.loading">
        <el-row id="sortableRef" v-if="list.data.length">
          <el-col
            v-for="(item, index) in list.data"
            :key="'album-item-' + index + '-' + item.id"
            :xl="6"
            :lg="8"
            :md="12"
            class="drag-box-col">
            <album-item
              :album="item"
              :editable="editable"
              @submit="itemOperate(item, $event)"
              @click="handleClick(item)"></album-item>
          </el-col>
        </el-row>
        <c-empty v-else></c-empty>
      </div>
      <div class="album-pagination">
        <pagination
          v-model:page="list.page"
          v-model:size="list.size"
          :total="list.total"
          :page-sizes="[12, 24, 48, 96]"
          @change="listGet"/>
      </div>
    </c-card>

    <edit-dialog
      v-if="visible.edit"
      v-model="visible.edit"
      :detail="item.data"
      @submit="listGet"/>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { AlbumInter, ListInter } from '@/typings/interface'
import { useCtxInstance, useDeleteConfirm, useDragSort } from '@/hooks/global'
import { PageResponse } from '@/typings/req-res'
import EditDialog from './EditDialog.vue'
import useConfigStore from '@/store/config'
import { useFormat } from '@/hooks/date-time'
import AlbumItem from '@/components/web/album/index.vue'
import Album from '@/types/Album'
import { useRouter } from 'vue-router'
/**
 * 实例
 */
const ctx = useCtxInstance()
const album = new Album()
const configStore = useConfigStore()
const router = useRouter()
const types = ref([
  { label: '全部相册', value: '' },
  { label: '私密相册', value: 0 },
  { label: '公开相册', value: 1 },
  { label: '密码访问', value: 2 }
])

/**
 * 变量
 */
const list: ListInter<AlbumInter> = reactive({
  total: 0,
  page: 1,
  size: 12,
  filters: {
    search: '',
    access_type: ''
  },
  data: [],
  loading: false
})
// 当前被操作项
let item = reactive({
  data: null
})
const visible = reactive({
  edit: false
})

/**
 * 逻辑处理
 */
// 获取数据
const listGet = () => {
  list.loading = true
  album.find({
    page: list.page,
    size: list.size,
    ...list.filters
  }).then((res: PageResponse<AlbumInter, { id: number, count: number }>) => {
    list.data = res.items.map(item => {
      item.count = res.stats.find(stat => stat.id === item.id).count
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
    list.total = res.total
    list.loading = false
  })
}
listGet()

// 操作
const itemOperate = (data: AlbumInter, type) => {
  item.data = data
  visible[type] = true
  if (type === 'delete') {
    useDeleteConfirm().then(() => {
      album.delete(data.id).then(res => {
        ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
        listGet()
      })
    })
  }
  if (type === 'upload') {
    router.push({
      path: '/',
      query: {
        album_id: data.id,
        from: 'album'
      }
    })
  }
}
const handleClick = (data: AlbumInter) => {
  router.push({
    path: '/albums/images',
    query: {
      id: data.id
    }
  })
}


const editable = ref(false)
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
  list.loading = true
  const [from, to] = [list.data[fromIndex], list.data[toIndex]]
  album.sort(from.id, to.id).then(() => {
    listGet()
  })
}
// 搜索
function handleInput (val) {
  setTimeout(() => {
    listGet()
  }, 1000)
}
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
$border: 1px solid #e9ecef;
$border-active: 1px solid #32cfaa;
$text-color: #747a80;
$text-color-active: #32cfaa;
@mixin border($active: false) {
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  @if $active {
    border-color: #32cfaa;
  } @else {
    border-color: #e9ecef;
  }
}
.album-container {
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
  
  .album-list {
    flex: 1;
    .el-row {
      width: 100%;
      height: 100%;
      align-content: flex-start;
      .el-col {
        padding: 8px;
      }
    }
  }
  .album-pagination {
    flex-shrink: 0;
  }

  .album-filter {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 5px;
    flex-shrink: 0;
    .el-button-group {
      margin-right: 12px;
    }
    .el-select {
      width: 180px;
    }
  }
}
</style>