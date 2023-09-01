<template>
  <div class="wiki-conatiner">
    <div class="wiki-toolbar">
      <div class="wiki-toolbar-filter">
        <el-input placeholder="请输入搜索内容"></el-input>
      </div>
      <div class="wiki-toolbar-action">
        <el-button type="primary" @click="visible.edit = true">新增</el-button>
      </div>
    </div>
    <div class="wiki-main">
      <el-row>
        <el-col :xl="6" :lg="8" :md="12" v-for="item in 8" :key="item">
          <wiki-item></wiki-item>
        </el-col>
      </el-row>
    </div>
    <div class="wiki-pagination">
      <pagination
        v-model:page="list.page"
        v-model:size="list.size"
        :total="list.total"
        :page-sizes="[18, 36, 72, 100]"
        @change="listGet"/>
    </div>
    <edit-wiki
      v-if="visible.edit"
      v-model="visible.edit"
      :detail="item.data"
      @submit="listGet"></edit-wiki>
  </div>
</template>
<script lang="ts" setup>
import Wiki from '@/types/Wiki';
import { ListInter, WikiInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { reactive } from 'vue';
import WikiItem from './wiki-item.vue'
import EditWiki from './EditWiki.vue'
/**
 * 实例
 */
const wiki = new Wiki()

/**
 * 变量
 */
const list: ListInter<WikiInter> = reactive({
  page: 1,
  size: 18,
  total: 0,
  loading: false,
  filters: {
  },
  data: []
})
const visible = reactive({
  edit: false
})
const item: { data: WikiInter } = reactive({
  data: null
})

/**
 * 逻辑处理
 */
function listGet () {
  wiki.find({}).then((res: PageResponse<WikiInter>) => {
    list.data = res.items
  })
}
listGet()
</script>
<style lang="scss">
.wiki-conatiner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  .el-row {
    .el-col {
      padding: 5px 10px 15px;
    }
  }
  .wiki-toolbar {
    padding: 20px 20px 5px 20px;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding-bottom: 2px;
  }
  .wiki-main {
    flex: 1;
    overflow: auto;
    padding: 0 10px;
  }
  .wiki-pagination {
    flex-shrink: 0;
    padding: 0 20px 20px;
  }
} 
</style>