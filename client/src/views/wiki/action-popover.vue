<template>
  <!-- <el-popover :placement="placement" :trigger="trigger" popper-class="action-popover">
    <template #reference>
      <slot name="reference"></slot>
      <div class="action"><el-icon><Plus /></el-icon></div>
    </template>
    <div class="popover-action-menu">
      <div
        v-for="(item, index) in actions"
        :key="'action-item-' + index"
        class="popover-action-menu-item"
        @click="handleClick(item)">
        <component :is="components[item.icon]" :size="item.size" :color="item.color"></component>
        <span class="menu-item-text">{{ item.text }}</span>
      </div>
    </div>
  </el-popover> -->
  <el-dropdown popper-class="action-popover" :placement="placement" :trigger="trigger">
    <slot name="reference"></slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in actions"
          :key="'action-item-' + index"
          @click="handleClick(item)">
          <component :is="components[item.icon]" :size="item.size" :color="item.color"></component>
          <span class="menu-item-text">{{ item.text }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ActionItemInter, ArticleInter } from '@/typings/interface'


interface Props {
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
  trigger?: 'hover' | 'click'
  actions: Array<ActionItemInter>
  parent?: ArticleInter
}

/**
 * 实例
 */
const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-end',
  trigger: 'click',
  actions: () => ([]),
  parent: () => ({
    id: 0
  })
})
const emit = defineEmits(['action'])

/**
 * 变量
 */
const components = ref({})

/**
 * 逻辑处理
 */
// 异步加载组件
async function loadComponent () {
  const icons = ['file', 'folder', 'excel', 'mindmap', 'diagram', 'magic', 'import', 'canvas', 'copy', 'delete', 'export', 'docx', 'pdf', 'markdown', 'html']
  icons.forEach(async (icon: string) => {
    // 使用 import 语法动态加载组件文件
    const { default: component } = await import(`./icons/icon-${icon}.vue`);
    components.value[icon] = component
  })
}
loadComponent()
function handleClick (item) {
  emit('action', {
    ...item,
    ...props.parent
  })
}
</script>
<style lang="scss">
.action-popover {
  padding: 12px 5px !important;
  animation: all .3s;
  .popover-action-menu {
    display: flex;
    flex-direction: column;
    &-item {
      height: 32px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      cursor: pointer;
      margin-bottom: 2px;
      &:hover {
        background: var(--el-fill-color);
        border-radius: 4px;
      }
      .wiki-icon {
        margin-right: 8px;
      }
      > span.menu-item-text {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>