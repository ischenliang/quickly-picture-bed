<template>
  <div class="album-container">
    <c-card :title="'我的相册(' + list.total + ')'">
      <div></div>
      <el-row>
        <el-col :xl="6" v-for="(item, index) in 8" :key="index">
          <div class="album-item">

          </div>
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
import { AlbumInter, BucketInter, ListInter } from '@/typings/interface'
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { PageResponse } from '@/typings/req-res'
import EditDialog from './EditDialog.vue'
import useConfigStore from '@/store/config'
import { useFormat } from '@/hooks/date-time'
import Album from '@/types/Album'
interface Stats {
  id: string
  bucket_storage: string
  bucket_count: number
}
/**
 * 实例
 */
const ctx = useCtxInstance()
const album = new Album()
const configStore = useConfigStore()

/**
 * 变量
 */
const list: ListInter<AlbumInter, Stats> = reactive({
  total: 0,
  filters: {
    name: '',
    sort: 'updatedAt',
    order: 'desc'
  },
  data: [],
  stats: []
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
  }).then((res: PageResponse<AlbumInter, Stats>) => {
    list.total = res.total
    console.log(res.items, res.total)
  })
}
listGet()

// 操作
const itemOperate = (data: BucketInter, type) => {
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
  .el-card__body {
    overflow: auto;
  }
  .album-item {
    height: 250px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .el-row {
    .el-col {
      padding: 10px;
    }
  }
}
</style>