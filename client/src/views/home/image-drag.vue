<template>
  <div class="bucket-title">预览专区</div>
  <div class="bucket-drag-box" ref="sortableRef" v-loading="loading">
    <div class="drag-item" v-for="item in images" :key="item.id" :data-id="item.id">
      <div class="drag-item-main">
        <div class="drag-item-icon">
          <icon-drag></icon-drag>
        </div>
        <div class="drag-item-img">
          <img :src="item.preview_url" alt="">
        </div>
        <div class="drag-item-content">
          <div class="drag-item-filename">{{ item.name }}</div>
          <div class="drag-item-filesize">{{ useFormatImageSize(item.size) }}</div>
        </div>
        <div class="drag-item-action">
          <el-tooltip effect="dark" content="移除当前记录，并不删除实际数据，如需删除请前往图库删除" placement="top">
            <div class="drag-item-action-item" @click="handleClick(item)">
              <el-icon><DeleteFilled /></el-icon>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import iconDrag from '@/components/icons/icon-drag.vue'
import Sortable from 'sortablejs'
import useUserStore from '@/store/user';
import { useFormatImageSize } from '@/hooks/global';
import { ImageInter } from '@/typings/interface';
import Image from '@/types/Image';
/**
 * 实例
 */
const sortableRef = ref(null)
const sortable = ref(null)
const userStore = useUserStore()


/**
 * 变量
 */
const images = computed(() => {
  return userStore.currentImages
})
const loading = ref(false)


/**
 * 逻辑处理
 */
// 参考配置: http://www.sortablejs.com/options.html
function initSortable () {
  sortable.value = Sortable.create(sortableRef.value, {
    handle: '.drag-item-icon', // 拖拽的元素，使列表单元中符合选择器的元素成为拖动的手柄，只有按住拖动手柄才能使列表单元进行拖动
    draggable: '.drag-item', // 允许拖拽的项目类名
    ghostClass: 'ghost', // drop placeholder的css类名
    chosenClass: 'chosen', // 被选中项的css 类名
    dragClass: 'drag', // 正在被拖拽中的css类名
    // 1、设置数据
    // setData: (dataTransfer: DataTransfer, dragEl: HTMLElement) => {
    //   dataTransfer.setData('Text', dragEl.textContent);
    // },
    // 2、元素被选中
    // onChoose: (evt) => {
    //   console.log(evt.oldIndex) // 拖拽元素所在索引
    // },
    /**
     * 3、元素未被选中的时候（从选中到未选中）
     * @param evt 
     *  与onEnd相同的属性
     */
    // onUnchoose: (evt) => {
    // },
    /**
     * 4、开始拖拽的时候
     * @param evt 
     */
    // onStart: (evt: any) => {
    //   console.log(evt.oldIndex)
    // },
    /**
     * 5、结束拖拽
     * @param event 
     *  to: 目标容器 -> 父容器
     *  from: 旧目标容器 -> 旧父容器
     *  oldIndex: 拖拽元素在父容器的旧索引
     *  newIndex: 拖拽元素在父容器的新索引
     *  clone: 克隆的元素
     *  pullMode: 如果项目在另一个可排序表中：`“clone”`如果克隆，`true`如果移动
     */
    onEnd: (event) => {
      const { oldIndex, newIndex } = event
      const [from, to] = [images.value[oldIndex], images.value[newIndex]]
      // data.value.splice(oldIndex, 1, to)
      // data.value.splice(newIndex, 1, from)
      loading.value = true
      const image = new Image()
      image.sort(from.id, to.id).then(() => {
        userStore.currentImages.splice(oldIndex, 1, to)
        userStore.currentImages.splice(newIndex, 1, from)
        loading.value = false
      })
    },
    /**
     * 6、元素从一个列表拖拽到另一个列表
     * @param evt 和onEnd的属性相同
     */
    // onAdd: (evt) => {},
    /**
     * 7、列表内元素顺序更新的时候触发
     * @param evt 和onEnd的属性相同
     */
    // onUpdate: (evt) => {},
    /**
     * 8、列表的任何更改都会触发
     * @param evt 和onEnd的属性相同
     */
    // onSort: (evt) => {},
    /**
     * 9、元素从列表中移除进入另一个列表
     * @param evt 和onEnd的属性相同
     */
    // onRemove: (evt) => {},
    /**
     * 10、试图拖拽一个filtered的元素
     * @param evt 
     */
    // onFilter: (evt) => {
    //   // HTMLElement接收`mousedown| tapstart`事件。
    //   var itemEl = evt.item
    // },
    /**
     * 11、拖拽移动的时候
     * @param event 
     *  dragged：dragged HTMLElement
     *  draggedRect：DOMRect {left, top, right, bottom}
     *  related：HTMLElement on which have guided
     *  relatedRect：DOMRect
     *  willInsertAfter：Boolean that is true if Sortable will insert drag element after target by default
     * @param originalEvent 
     *  clientY：mouse position
     * @returns 
     *  false: 取消
     *  -1: 在目标前插入
     *  1: 在目标后插入
     */
    onMove: (event, originalEvent) => {
      const [formId, toId] = [event.dragged.dataset.id, event.related.dataset.id]
      // return 1
    },
    /**
     * 12、clone一个元素的时候触发
     * @param evt 
     *  item: 
     *  clone: 
     */
    // onClone: (evt) => {},
    /**
     * 13、拖拽元素改变位置的时候
     * @param evt 
     *  newIndex: 使用此事件的最可能原因是获取拖动元素的当前索引
     *  other same: 和onEnd的属性相同
     */
    // onChange: (evt) => {

    // }
  })
}
// 删除按钮点击
function handleClick (item: ImageInter) {
  const index = userStore.currentImages.findIndex(el => el.id === item.id)
  userStore.currentImages.splice(index, 1)
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
  background: var(--el-color-success-light-9);
  border-radius: 0 0 10px 10px;
  color: var(--el-color-success) !important;
  font-weight: bold;
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
  &-main {
    width: 100%;
    height: 100%;
    padding: 0 5px;
    display: flex;
    align-items: center;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
  }
  &-icon {
    width: 15px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    height: 100%;
    cursor: move;
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
    color: var(--el-text-color-regular);
  }
  &-filesize {
    font-size: 13px;
    color: var(--el-text-color-secondary);
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
      color: var(--el-color-danger);
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
</style>