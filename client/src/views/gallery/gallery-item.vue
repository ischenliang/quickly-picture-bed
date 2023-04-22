<template>
  <div :class="['gallery-item', data.checked ? 'gallery-item-active' : '']">
    <div class="gallery-item-cover">
      <slot name="tags"></slot>
      <span class="gallery-item-top" v-if="remove && data.sort > 0"><el-icon><Flag /></el-icon>置顶</span>
      <el-tooltip effect="dark" content="重新上传，覆盖图片" placement="top-end" >
        <span class="gallery-item-edit" @click.stop="actions.update">
          <el-icon :size="16"><Sunset /></el-icon>
        </span>
      </el-tooltip>
      <el-image :src="data.img_preview_url" :fit="'cover'" :lazy="true" />
    </div>
    <div class="gallery-item-name" :title="data.img_name">
      {{ data.img_name }}
    </div>
    <div class="gallery-item-action">
      <el-tooltip v-for="(item, index) in btns" :key="index" effect="dark" :content="item.title" placement="bottom">
        <el-button
          :type="item.type"
          :icon="item.icon"
          :size="'small'"
          :disabled="item.disabled"
          @click.stop="actions[item.action]" />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ImageInter } from '@/typings/interface';
import { computed, reactive, Ref, ref, watch } from 'vue';
import { useCopyText, useCtxInstance } from '@/hooks/global';

interface Props {
  data: ImageInter
  fit?: string
  images?: Array<string>
  remove?: boolean
}
/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  fit: 'scale-down',
  remove: false,
  data: () => ({
    img_name: '',
    img_preview_url: '',
    checked: false
  } as ImageInter)
})
const emit = defineEmits(['update:data', 'reload', 'submit'])
const ctx = useCtxInstance()


/**
 * 变量
 */
const myData = computed({
  get () {
    return props.data
  },
  set (val) {
    emit('update:data', val)
  }
})
const defaultBtns = [
  { icon: 'CopyDocument', type: 'primary', title: '复制图片地址', action: 'copy' },
  // props.remove ? 
  // { icon: 'Close', type: 'success', title: '移除图片', action: 'remove' } : 
  { icon: 'Select', type: 'success', title: '选择图片', action: 'select' },
  // { icon: 'Crop', type: 'warning', title: '裁剪图片', action: 'crop', disabled: true },
  { icon: 'InfoFilled', type: 'info', title: '图片详情', action: 'detail' },
  { icon: 'Delete', type: 'danger', title: '删除图片', action: 'delete' }
]
// 按钮组
const btns: Ref<Array<{
  icon?: string
  type?: string
  title?: string
  action?: string
  disabled?: boolean
}>> = ref([...defaultBtns])



watch(() => props.data, () => {
  if (props.remove) {
    if (props.data.sort === 0) {
      btns.value = [
        ...defaultBtns,
        { icon: 'Flag', type: 'warning', title: '置顶图片', action: 'topping' }
      ]
    } else {
      btns.value = [
        ...defaultBtns,
        { icon: 'SoldOut', type: 'warning', title: '取消置顶', action: 'unTopping' }
      ]
    }
  }
}, {
  deep: true,
  immediate: true
})


/**
 * 回调函数：按钮点击行为
 */
const actions = {
  // 复制链接地址
  copy () {
    const text = myData.value.img_preview_url
    useCopyText(ctx, text)
  },
  // 选择
  select () {
    myData.value.checked = !myData.value.checked
  },
  // 裁剪
  crop () {},
  // 详情
  detail () {
    emit('submit', { type: 'detail', data: myData.value })
  },
  /**
   * 先删除文件，后删除数据
   */
  delete () {
    emit('submit', { type: 'delete', data: myData.value })
  },
  // 移除图片
  remove () {
    emit('submit', { type: 'remove', data: myData.value })
  },
  // 置顶图片
  topping () {
    emit('submit', { type: 'top', data: myData.value })
  },
  // 取消置顶
  unTopping () {
    emit('submit', { type: 'unTop', data: myData.value })
  },
  // 覆盖文件
  update () {
    emit('submit', { type: 'update', data: myData.value })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/text.scss';
.gallery-item {
  // padding: 10px;
  // width: 270px;
  // height: 210px;
  height: 200px;
  // border: 1px solid #dcdee2;
  border: 1px solid #e9ecef;
  border-radius: 8px 8px 4px 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  &.gallery-item-active {
    background: rgba(204,232,255,.5);
    border: 1px solid rgba(153,209,255,.57);
  }

  .gallery-item-cover {
    flex: 1;
    overflow: hidden;
    position: relative;
    .gallery-item-top {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 12px;
      padding: 3px 8px;
      background: #409eff;
      z-index: 3;
      display: flex;
      align-items: center;
      border-radius: 4px 0 4px 0;
      color: #fff;
      i {
        margin-right: 3px;
      }
    }

    .gallery-item-edit {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      padding: 3px 8px;
      background: #409eff;
      z-index: 3;
      display: flex;
      align-items: center;
      border-radius: 0 4px 0 4px;
      color: #fff;
      display: none;
    }

    .el-image {
      width: 100%;
      height: 100%;
      transition: all 0.3s;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }

  .gallery-item-name {
    height: 26px;
    flex-shrink: 0;
    color: #8492a6;
    font-size: 14px;
    text-align: center;
    margin: 3px 0;
    line-height: 26px;
    padding: 0 10px;
    @include line-text-ellipsis(1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gallery-item-action {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 0 10px 10px;

    .el-button {
      +.el-button {
        margin-left: 8px;
      }
    }
  }

  &:hover {
    // .gallery-item-cover {
    //   .el-image {
    //     transform: scale(1.2);
    //     // opacity: 0.60;
    //   }
    // }
    transform: translateY(-5px);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
    border-color: #fff;
    .gallery-item-edit {
      display: flex;
    }
  }
}
</style>