<template>
  <div :class="['gallery-item', data.checked ? 'gallery-item-active' : '']">
    <div class="gallery-item-cover">
      <el-image :src="data.img_preview_url" :fit="'scale-down'" :lazy="true" />
    </div>
    <div class="gallery-item-name" :title="data.img_name">{{ data.img_name }}</div>
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
import { computed, reactive, ref } from 'vue';
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
// 按钮组
const btns = ref([
  { icon: 'CopyDocument', type: 'primary', title: '复制图片地址', action: 'copy' },
  props.remove ? 
  { icon: 'Close', type: 'success', title: '移除图片', action: 'remove' } : 
  { icon: 'Select', type: 'success', title: '选择图片', action: 'select' },
  { icon: 'Crop', type: 'warning', title: '裁剪图片', action: 'crop', disabled: true },
  { icon: 'InfoFilled', type: 'info', title: '图片详情', action: 'detail' },
  { icon: 'Delete', type: 'danger', title: '删除图片', action: 'delete' }
])


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
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/text.scss';
.gallery-item {
  padding: 10px;
  // width: 270px;
  height: 210px;
  // border: 1px solid #dcdee2;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  cursor: pointer;
  position: relative;
  &.gallery-item-active {
    background: rgba(204,232,255,.5);
    border: 1px solid rgba(153,209,255,.57);
  }

  .gallery-item-cover {
    flex: 1;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
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
    @include line-text-ellipsis(1);
  }

  .gallery-item-action {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    .el-button {
      +.el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>