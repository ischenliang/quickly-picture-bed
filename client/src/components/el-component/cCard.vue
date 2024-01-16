<template>
  <el-card
    class="c-card"
    :shadow="shadow">
    <template #header style="padding: 20px;">
      <div class="c-card__header">
        <div class="c-card__header-title">
          <slot name="title">
            <span>{{ title }}</span>
          </slot>
        </div>
        <div class="c-card__header-action">
          <slot name="cardAction"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  shadow?: "never" | "always" | "hover"
  headerPadding?: string
}
withDefaults(defineProps<Props>(), {
  title: 'Card name',
  shadow: 'never',
  headerPadding: '15px 20px'
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
    border-bottom: 1px solid var(--el-border-color);
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
    &-title {

    }
    &-action {
      display: flex;
      gap: 15px;
      .el-button+.el-button {
        margin-left: 0px !important;
      }
    }
  }
}
</style>