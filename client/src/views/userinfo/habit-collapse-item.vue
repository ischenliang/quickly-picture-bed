<template>
  <div class="habit-collapse-item" :style="style">
    <div class="habit-collapse-item__left">
      <div class="habit-collapse-item-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="habit-collapse-item-desc">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
    <div :class="{
      'habit-collapse-item__right': true,
      column: direction === 'column'
    }" :style="{
      'width': direction === 'row' ? '' : '100%'
    }">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  desc?: string
  direction?: 'row' | 'column'
  border?: boolean
}>(), {
  direction: 'row',
  border: true
})
const style: any = computed(() => {
  if (props.direction === 'row') {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: props.border ? '1px solid var(--el-border-color)' : ''
    }
  }
  return {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottom: props.border ? '1px solid var(--el-border-color)' : ''
  }
})
</script>
<style lang="scss">
.habit-collapse-item {
  width: 100%;
  min-height: 30px;
  padding: 10px 0;
  display: flex;
  &__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    .habit-collapse-item-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--el-text-color-regular);
    }
    .habit-collapse-item-desc {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
  &__right {
    flex-shrink: 0;
    margin-left: 10px;
    &.column {
      margin-left: 0px !important;
    }
  }
}
</style>