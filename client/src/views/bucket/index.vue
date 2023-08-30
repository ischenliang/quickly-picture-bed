<template>
  <div class="bucket-container">
    <c-card :title="'存储桶'" v-loading="list.loading">
      <el-row>
        <!-- 新建 -->
        <el-col :xl="6" :lg="8" :md="12">
          <bucket-item :create="true" @click="itemOperate(null, 'edit')"></bucket-item>
        </el-col>
        <!-- 遍历存储桶列表 -->
        <el-col :xl="6" :lg="8" :md="12" v-for="(item, index) in list.data" :key="index">
          <bucket-item :detail="item">
            <template #action>
              <div class="bucket-action-item" @click="itemOperate(item, 'edit')">编辑</div>
              <div class="bucket-action-item" @click="itemOperate(item, 'toggle')">{{ item.visible ? '禁用' : '启用' }}</div>
              <div class="bucket-action-item" @click="itemOperate(item, 'delete')">删除</div>
              <div class="bucket-action-item" @click="itemOperate(item, 'migrate')">迁移</div>
            </template>
          </bucket-item>
        </el-col>
      </el-row>
    </c-card>

    <!-- 编辑弹窗 -->
    <edit-dialog
      v-if="visible.edit"
      v-model="visible.edit"
      :detail="item.data"
      @submit="listGet"/>
    <!-- 数据迁移弹窗 -->
    <migrate-dialog
      v-if="visible.migrate"
      v-model="visible.migrate"
      :detail="item.data"
      @submit="listGet"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { BucketInter, ListInter, UserInter } from '@/typings/interface'
import { useCtxInstance, useDeleteConfirm } from '@/hooks/global'
import { PageResponse } from '@/typings/req-res'
import EditDialog from './EditDialog.vue'
import MigrateDialog from './MigrateDialog.vue'
import Bucket from '@/types/Bucket'
import { useFormat } from '@/hooks/date-time'
import BucketItem from './BucketItem.vue'
interface Stats {
  id: string
  bucket_storage: string
  bucket_count: number
}
interface Versions {
  id: string
  version: string
  version_last: string
}
/**
 * 实例
 */
const ctx = useCtxInstance()
const bucket = new Bucket()
/**
 * 变量
 */
const list: ListInter<BucketInter, Stats, Versions> = reactive({
  total: 0,
  filters: {
    name: ''
  },
  data: [],
  stats: [],
  versions: [],
  loading: false
})
// 当前被操作项
let item = reactive({
  data: null
})
const visible = reactive({
  edit: false,
  migrate: false
})

/**
 * 逻辑处理
 */
// 获取数据
const listGet = () => {
  list.loading = true
  bucket.find({
    ...list.filters
  }).then((res: PageResponse<BucketInter, Stats, Versions>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.createdAt = useFormat(item.createdAt)
      item.updatedAt = useFormat(item.updatedAt)
      return item
    })
    list.loading = false
  })
}
listGet()

// 操作
const itemOperate = (data: BucketInter, type) => {
  console.log(data, type)
  item.data = data && JSON.parse(JSON.stringify(data))
  visible[type] = true
  if (type === 'delete') {
    useDeleteConfirm('确定要删除本存储桶吗？(删除后关联的图片将无法访问)').then(() => {
      bucket.delete(data.id).then(res => {
        ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
        listGet()
      })
    })
  }
  if (type === 'toggle') {
    useDeleteConfirm(`确定要${ data.visible ? '禁用' : '启用' }该存储桶吗？`).then(() => {
      bucket.toggle(data.id).then(res => {
        ctx.$message({ message: `${ data.visible ? '禁用' : '启用' }成功`, type: 'success', duration: 1000 })
        listGet()
      })
    })
  }
}
</script>

<style lang="scss">
.bucket-container {
  width: 100%;
  height: 100%;
  .el-card__body {
    padding-top: 50px;
    overflow: auto;
  }
  .el-row {
    .el-col {
      padding: 10px 15px 40px;
    }
  }
}
</style>