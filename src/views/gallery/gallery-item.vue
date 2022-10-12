<template>
  <div :class="['gallery-item', data.checked ? 'gallery-item-active' : '']">
    <div class="gallery-item-cover">
      <el-image :src="data.url" :fit="'scale-down'" />
    </div>
    <div class="gallery-item-name">{{ data.name }}</div>
    <div class="gallery-item-action">
      <el-tooltip v-for="(item, index) in btns" :key="index" effect="dark" :content="item.title" placement="bottom">
        <el-button
          :type="item.type"
          :icon="item.icon"
          :size="'small'"
          @click="actions[item.action]" />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

interface Props {
  data: {
    url: string
    name: string,
    checked: boolean
  },
  fit?: string
}
const props = withDefaults(defineProps<Props>(), {
  fit: 'scale-down'
})

const emit = defineEmits(['update:data'])

const myData = computed({
  get () {
    return props.data
  },
  set (val) {
    emit('update:data', val)
  }
})


const btns = ref([
  { icon: 'CopyDocument', type: 'primary', title: '复制图片地址', action: 'copy' },
  { icon: 'Select', type: 'success', title: '选择图片', action: 'select' },
  { icon: 'Crop', type: 'warning', title: '裁剪图片', action: '' },
  { icon: 'InfoFilled', type: 'info', title: '图片详情', action: '' },
  { icon: 'Delete', type: 'danger', title: '删除图片', action: '' }
])

const actions = {
  // 复制
  copy () {},
  // 选择
  select () {
    myData.value.checked = !myData.value.checked
  },
  // 裁剪
  crop () {},
  // 详情
  detail () {},
  // 删除
  delete () {}
}
</script>

<style lang="scss" scoped>
.gallery-item {
  padding: 10px;
  // width: 270px;
  height: 250px;
  border: 1px solid #dcdee2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  cursor: pointer;
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
  }

  .gallery-item-name {
    height: 26px;
    flex-shrink: 0;
    color: #8492a6;
    font-size: 14px;
    text-align: center;
    margin: 3px 0;
    line-height: 26px;
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