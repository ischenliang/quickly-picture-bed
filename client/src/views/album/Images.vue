<template>
  <div class="album-images">
    <div
      class="album-image-header"
      :style="{
        'background-color': detail.background || '#009688'
      }">
      <div class="album-actions">
        <el-button type="primary" icon="Back" @click="() => $router.back()">返回</el-button>
        <el-button type="success" icon="UploadFilled" @click="goUpload">去上传</el-button>
      </div>
      <div class="album-actions-footer">
        <el-button type="info" icon="Tools" size="small" @click="item.tags = true">标签模板</el-button>
        <template v-if="selected.length">
          <el-button type="warning" v-if="selected.length === 1" @click="handleRename">重命名</el-button>
          <el-button v-if="selected.length === 1" type="success" icon="Picture" size="small" @click="handleAction('cover')">设为封面</el-button>
          <el-button v-if="selected.length === 1" type="success" icon="Stamp" size="small" @click="handleAction('tag')">标签管理</el-button>
          <el-dropdown class="copy-link-type" trigger="click" @command="(func) => func()">
            <el-button type="primary" icon="DocumentCopy" size="small">复制链接</el-button>
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
          <el-button type="warning" icon="Close" size="small" @click="handleAction('remove')">移出相册</el-button>
          <el-button type="danger" icon="Delete" size="small" @click="handleAction('delete')">删除所选</el-button>
        </template>
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
        <div class="filter-tags" v-if="album_tag.tags.length >= 2">
          <span>标签搜索:</span>
          <span
            v-for="(tag, index) in album_tag.tags"
            :key="'filter-tag-' + index"
            :class="['filter-tag-item', tag.value === list.filters.tag.value ? 'active' : '']"
            @click="changeTag(tag)">
            {{ tag.value }}
          </span>
        </div>
      </div>
      <div class="album-image-list" v-loading="list.loading">
        <el-row v-if="list.data.length">
          <template v-for="(item, index) in list.data" :key="'gallery-item' + index">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <gallery-item
                :data="item"
                :remove="true"
                :images="list.data.map(item => item.preview_url)"
                @reload="listGet"
                :key="list.page + '-' + index"
                @submit="handleItemSubmit"
                @view="handleClick(index)">
                <template #tags>
                  <div class="album-tags">
                    <el-tag
                      size="small"
                      v-for="(tag, tIndex) in item.tags"
                      :key="'tag-' + tIndex"
                      :type="(tag.type as any)">
                      {{ tag.value }}
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
      :id="item.data.id"
      @submit="listGet"/>
    <!-- 标签编辑 -->
    <tag-dialog
      v-if="item.edit"
      v-model="item.edit"
      :detail="item.data"
      :tags="album_tag"
      @submit="() => { getTags();listGet(); }" />
    <!-- 默认标签 -->
    <default-tags
      v-if="item.tags"
      v-model="item.tags"
      :detail="album_tag"
      @submit="getTags" />
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCopyText, useCtxInstance, useDeleteConfirm, useListFilter } from '@/hooks/global';
import Album from '@/types/Album';
import Image from '@/types/Image';
import { AlbumInter, ImageInter, ListInter, AlbumTag } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { computed, reactive, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailDialog from '@/views/gallery/DetailDialog.vue'
import TagDialog from './TagDialog.vue'
import defaultTags from './default-tags.vue'
import GalleryItem from '@/views/gallery/gallery-item.vue'
import { linkTypes } from '@/global.config';
import { ElMessageBox } from 'element-plus';

/**
 * 实例
 */
const album = new Album()
const route = useRoute()
const router = useRouter()
const image = new Image()
const ctx = useCtxInstance()


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
    album_id: +route.query.id || 0,
    tag: {
      type: '',
      value: '全部'
    },
    img_name: ''
  },
  data: []
})
// 已勾选数据
const selected: Ref<ImageInter[]> = computed(() => {
  return list.data.filter(el => el.checked)
})
const item: {
  detail: boolean
  edit: boolean
  tags: boolean
  data: ImageInter
} = reactive({
  detail: false,
  data: null,
  edit: false,
  tags: false,
})
// 所有标签
const album_tag: Ref<AlbumTag> = ref(null)

/**
 * 数据获取
 */
// 获取标签列表
function getTags (callback: Function = () => {}) {
  album.tags(+route.query.id).then((res: AlbumTag) => {
    album_tag.value = res
    album_tag.value.tags.unshift({ type: 'primary', value: '全部' })
    if (!album_tag.value.tags.includes(list.filters.tag)) {
      list.filters.tag = {
        type: '',
        value: '全部'
      }
      callback()
    }
  })
}
getTags()
// 相册详情获取
function getDetail () {
  const id = route.query.id
  if (id) {
    album.detail(+id).then((res: AlbumInter) => {
      res.createdAt = useFormat(res.createdAt, 'YYYY-MM-DD')
      res.updatedAt = useFormat(res.updatedAt, 'YYYY-MM-DD')
      detail.value = res
    })
    listGet()
  }
}
getDetail()
// 获取图片列表
function listGet () {
  list.loading = true
  album.images({
    page: list.page,
    size: list.size,
    id: list.filters.album_id,
    name: list.filters.img_name,
    tag: list.filters.tag
  }).then((res: PageResponse<ImageInter>) => {
    list.total = res.total
    list.data = res.items.map(item => {
      item.checked = false
      item.preview_url = item.baseurl + item.url
      return item
    })
    list.loading = false
  })
}
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
// 操作栏回调
function handleAction (type) {
  let ids = []
  switch (type) {
    case 'remove':
      ids = selected.value.map(item => item.id)
      useDeleteConfirm('确定将图片移出该相册吗？').then(() => {
        ids.map((id, index) => {
          image.update({
            id: id,
            album_id: '',
            sort: 0
          }).then(async (res) => {
            if (index === ids.length - 1) {
              ctx.$message({ message: '移除成功', duration: 1000, type: 'success' })
              listGet()
            }
          })
        })
      })
      break
    case 'delete':
      ids = selected.value.map(item => item.id)
      useDeleteConfirm().then(() => {
        ids.map((id, index) => {
          image.delete(id).then(res => {
            if (index === ids.length - 1) {
              ctx.$message({ message: '删除成功', duration: 1000, type: 'success' })
              listGet()
            }
          })
        })
      })
      break
    case 'cover':
      useDeleteConfirm('确定将该图片设置为相册封面吗？').then(() => {
        album.update({
          id: list.filters.album_id,
          cover: selected.value[0].preview_url
        }).then(res => {
          ctx.$message({ message: '封面设置成功', duration: 1000, type: 'success' })
        })
      })
      break
    case 'tag':
      item.edit = true
      item.data = selected.value[0]
      break
  }
}
// 下拉回调
function handleCommond (link: any) {
  const copyText = selected.value.map(item => {
    const obj = { url: item.preview_url, filename: item.name }
    return link.value.replace(/\$\{(.*?)\}/g, (v, key) => {
      return obj[key]
    })
  }).join('\n')
  useCopyText(ctx, copyText)
}

/**
 * 回调函数
 */
// 点击
function handleClick(index: number) {
  ctx.$viewerApi({
    options: {
      initialViewIndex: index
    },
    images: list.data.map(item => item.preview_url)
  })
}
// 按钮事件回调
function handleItemSubmit (e: { type: string, data: ImageInter }) {
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
          sort: 0
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
    case 'tag':
      item.edit = true
      item.data = e.data
      break
  }
}
// 切换标签
function changeTag (tag) {
  list.filters.tag = tag
  listGet()
}
// 去上传
function goUpload () {
  useListFilter(list, route.name, 'set')
  router.push({
    path: '/',
    query: {
      album_id: detail.value.id
    }
  })
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
    // background-color: #009688;
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
    box-shadow: 0px 1px 10px #0000001a;
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
    .album-actions-footer {
      position: absolute;
      bottom: -35px;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 0 5px;
      .el-button {
        height: 30px;
      }
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
      margin: 40px 0 0px;
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
        // .tags-edit {
        //   display: none;
        // }
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
  .copy-link-type {
    margin: 0 10px;
  }
}
</style>