<template>
  <div class="bucket-title">预览专区</div>
  <div class="bucket-drag-box" ref="sortableRef">
    <div class="drag-item" v-for="item in data" :key="item" :data-id="item">
      <div class="drag-item-main">
        <div class="drag-item-icon">
          <drag-icon></drag-icon>
        </div>
        <div class="drag-item-img">
          <!-- <img src="https://cdn.yopngs.com/2023/08/29/53930182-056c-4887-b413-c9f967091f35.png" alt=""> -->
          <img src="https://cdn.jsdelivr.net/gh/ischenliang/imgs@main/hehe/202308181557382748.png" alt="">
        </div>
        <div class="drag-item-content">
          <div class="drag-item-filename">创建空间{{ item }}.png</div>
          <div class="drag-item-filesize">86 KB</div>
        </div>
        <div class="drag-item-action">
          <el-tooltip effect="dark" content="移除" placement="top">
            <div class="drag-item-action-item">
              <el-icon><DeleteFilled /></el-icon>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import dragIcon from './drag-icon.vue'
import Sortable from 'sortablejs'
/**
 * 实例
 */
const sortableRef = ref(null)
const sortable = ref(null)

/**
 * 变量
 */
const data = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10
])


/**
 * 逻辑处理
 */
function initSortable () {
  sortable.value = Sortable.create(sortableRef.value, {
    draggable: '.drag-item', // 允许拖拽的项目类名
    ghostClass: 'ghost', // drop placeholder的css类名
    chosenClass: 'chosen', // 被选中项的css 类名
    dragClass: 'drag', // 正在被拖拽中的css类名
    onEnd: (event) => {
      console.log()
      const { oldIndex, newIndex } = event
      const [from, to] = [data.value[oldIndex], data.value[newIndex]]
      console.log(from, to)
    },
    onMove: (event, originalEvent) => {
      const [formId, toId] = [event.dragged.dataset.id, event.related.dataset.id]
    }
  })
}

/**
 * 生命周期
 */
onMounted(() => {
  initSortable()
})
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
.bucket-title {
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 15px;
  background: #e7f7f8;
  border-radius: 0 0 10px 10px;
  color: #0db3a6;
}
.bucket-drag-box {
  flex: 1;
  margin-top: 35px;
  position: relative;
  overflow: auto;
  padding: 0 10px 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}
.drag-item {
  width: 50%;
  padding: 3px;
  height: 56px;
  overflow: hidden;
  cursor: move;
  &-main {
    width: 100%;
    height: 100%;
    background: rgba(4, 193, 180, .1);
    // padding: 5px 5px 5px 0;
    padding: 0 5px;
    display: flex;
    color: #0db3a6;
    align-items: center;
  }
  &-icon {
    width: 15px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    height: 100%;
  }
  &-img {
    width: 40px;
    height: 40px;
    margin-right: 5px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: space-between;
  }
  &-filename {
    font-size: 15px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &-filesize {
    font-size: 13px;
  }
  &-action {
    flex-shrink: 0;
    min-width: 20px;
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    &-item {
      cursor: pointer;
      width: 20px;
      color: #ea644a;
    }
  }
}
</style>
<style lang="scss">
.drag-card {
  .el-card__body {
    padding: 0px !important;
  }
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.chosen {
  background: #0187C4;
}
.drag {
  background: blue;
}
</style>