<template>
  <el-card
    class="c-card"
    :shadow="shadow">
    <template #header style="padding: 20px;">
      <div class="c-card__header">
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
        <slot name="cardAction"></slot>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<script lang="ts" setup>
import { EpPropMergeType } from 'element-plus/es/utils';

interface Props {
  title?: string
  shadow?: EpPropMergeType<StringConstructor, "never" | "always" | "hover", unknown>
  headerPadding?: string
}
withDefaults(defineProps<Props>(), {
  title: 'Card name',
  shadow: 'never',
  headerPadding: '18px 20px'
})
</script>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.c-card {
  width: 100%;
  height: 100%;
  border: 0px !important;
  @include flex-layout(column);
  .el-card__header {
    border-bottom: 1px solid #f6f6f8;
    flex-shrink: 0;
    padding: v-bind(headerPadding);
  }
  .el-card__body {
    flex: 1;
  }
  .c-card__header {
    @include flex-layout-align(row, space-between, center);
    > :first-child {
      font-weight: bold;
    }
  }
}
</style>