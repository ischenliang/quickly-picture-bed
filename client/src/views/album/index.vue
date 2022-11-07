<template>
  <div class="album-container">
    <c-card :title="'我的相册(' + list.total + ')'">
      <template #cardAction>
        <el-button type="primary" @click="itemOperate(null, 'edit')">新增</el-button>
      </template>
      <el-row>
        <el-col :xl="6" v-for="(item, index) in list.data" :key="index">
          <album-item
            :album="item"
            @submit="itemOperate(item, $event)"></album-item>
        </el-col>
      </el-row>
    </c-card>

    <edit-dialog
      v-if="visible.edit"
      v-model="visible.edit"
      :detail="item.data"
      @submit="listGet"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { AlbumInter, ListInter } from '@/typings/interface'
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { PageResponse } from '@/typings/req-res'
import EditDialog from './EditDialog.vue'
import useConfigStore from '@/store/config'
import { useFormat } from '@/hooks/date-time'
import AlbumItem from '@/components/web/album/index.vue'
import Album from '@/types/Album'
/**
 * 实例
 */
const ctx = useCtxInstance()
const album = new Album()
const configStore = useConfigStore()

/**
 * 变量
 */
const list: ListInter<AlbumInter> = reactive({
  total: 0,
  filters: {
    name: '',
    sort: 'updatedAt',
    order: 'desc'
  },
  data: [
    {
      id: '',
      name: '回忆往事',
      desc: '一些好的回忆',
      cover: 'https://cdn.jsdelivr.net/gh/helinghands/cdn/img/memory_cover.jpg',
      background: ''
    },
    {
      id: '',
      name: '文章封面',
      desc: '文章所使用到的封面',
      cover: 'https://cdn.jsdelivr.net/gh/helinghands/cdn/img/921bab5e2277b8c4b2a9ba46de2b7056.jpg',
      background: ''
    },
    {
      id: '',
      name: '壁纸',
      desc: '收藏的一些好看的壁纸',
      cover: 'https://cdn.jsdelivr.net/gh/helinghands/cdn/img/wallpaper_cover.jpg',
      background: ''
    },
    {
      id: '',
      name: '美食',
      desc: '记录自己煮的或者吃过的美食',
      cover: 'https://cdn.jsdelivr.net/gh/helinghands/cdn/img/food_cover.jpg',
      background: ''
    }
  ]
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
  album.find({
    ...list.filters
  }).then((res: PageResponse<AlbumInter, { id: string, count: number }>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.cover_preview = configStore.systemConfig.website.baseUrl + item.cover
      item.count = res.stats.find(stat => stat.id === item.id).count
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
  })
}
listGet()

// 操作
const itemOperate = (data: AlbumInter, type) => {
  item.data = data
  visible[type] = true
  if (type === 'delete') {
    useDeleteConfirm().then(() => {
      album.delete(data.id)
        .then(res => {
        ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
        listGet()
      })
    })
  }
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
  }
  
  .el-row {
    .el-col {
      padding: 8px;
    }
  }
}
</style>