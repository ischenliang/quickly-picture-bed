<template>
  <com-dialog
    v-model="dialogVisible"
    :title="'主题'"
    :width="'800px'"
    :before-close="handleClose">
    <el-row class="theme-list">
      <el-col :span="8" v-for="(item, index) in themes" :key="index">
        <div :class="['theme-item', item.value === theme ? 'active' : '']" @click="changeTheme(item)">
          <div class="theme-item-cover">
            <img :src="`/images/theme/${item.value}.png`" :alt="item.label">
          </div>
          <div class="theme-item-title">{{ item.label }}</div>
        </div>
      </el-col>
    </el-row>
    <template #action>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </com-dialog>
</template>

<script lang="ts" setup>
import { ArticleInter } from '@/typings/interface';
import { computed, ref } from 'vue';

/**
 * 实例
 */
interface Props {
  modelValue: boolean
  detail: ArticleInter
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: () => ({} as ArticleInter)
})
const emit = defineEmits(['update:modelValue', 'submit'])


/**
 * 变量
 */
const dialogVisible = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  }
})

const themes = ref([
  { label: 'arknights', value: 'arknights' },
  { label: 'awesome-green', value: 'awesome-green' },
  { label: 'channing-cyan', value: 'channing-cyan' },
  { label: 'Chinese-red', value: 'Chinese-red' },
  { label: 'condensed-night-purple', value: 'condensed-night-purple' },
  { label: 'cyanosis', value: 'cyanosis' },
  { label: 'devui-blue', value: 'devui-blue' },
  { label: 'fancy', value: 'fancy' },
  { label: 'geek-black', value: 'geek-black' },
  { label: 'github', value: 'github' },
  { label: 'greenwillow', value: 'greenwillow' },
  { label: 'healer-readable', value: 'healer-readable' },
  { label: 'hydrogen', value: 'hydrogen' },
  { label: 'juejin', value: 'juejin' },
  { label: 'jzman', value: 'jzman' },
  { label: 'mk-cute', value: 'mk-cute' },
  { label: 'nico', value: 'nico' },
  { label: 'orange', value: 'orange' },
  { label: 'qklhk-chocolate', value: 'qklhk-chocolate' },
  { label: 'scrolls-light', value: 'scrolls-light' },
  { label: 'simplicity-green', value: 'simplicity-green' },
  { label: 'smartblue', value: 'smartblue' },
  { label: 'v-green', value: 'v-green' },
  { label: 'vue-pro', value: 'vue-pro' },
  { label: 'vuepress', value: 'vuepress' }
])
const theme = ref(props.detail.theme.markdown)

/**
 * 回调函数
 */
// 关闭窗口
const handleClose = () => {
  dialogVisible.value = false
}
// 提交
function changeTheme (item: any) {
  theme.value = item.value
}
// 提交
function submit () {
  emit('submit', theme.value)
  handleClose()
}
</script>

<style lang="scss">
.theme-list {
  .el-col {
    padding: 10px;
  }
  .theme-item {
    width: 100%;
    height: 170px;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
    color: var(--el-text-color-regular);
    cursor: pointer;
    &.active {
      border-color: var(--el-color-primary-light-3);
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
    &-cover {
      height: 130px;
      border-bottom: 1px solid #ddd;
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }
    &-title {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>