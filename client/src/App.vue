<template>
  <div class="container">
    <!-- <div class="my-btn">哈哈哈哈</div> -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import key from 'keymaster'

import { nextTick, watch } from 'vue';
import useUserStore from './store/user';

/**
 * 实例
 */
const userStore = useUserStore()


/**
 * 监听器
 */
watch(() => userStore.user_habits.data.shortKey, (val) => {
  nextTick(() => {
    // // 回调函数返回 false 以阻止浏览器默认事件行为
    // key('control + a', () => {
    //   console.log('绑定成功额')
    //   return false
    // })
    
    val && val.forEach(item => {
      console.log(item.value.toLowerCase())
      key(item.value.toLowerCase(), () => {
        console.log('绑定成功额')
        return false
      })
    })
  })
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="scss">
// @import 'reset.css';
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: var(--el-fill-color-light);
  // padding: 10px;
}
.user-info-popover {
  top: 1px !important;
  right: -5px !important;
}
.ghost {
  opacity: 0.5;
  background: var(--el-color-warning);;
}
.chosen {
  background: var(--el-color-info-light-5);;
}
.drag {
  background: var(--el-color-primary);
}

.el-card {
  background: var(--el-bg-color-white) !important;
}
.el-input {
  .el-input__wrapper {
    background: var(--el-bg-color-white) !important;
  }
}
.el-textarea {
  .el-textarea__inner {
    background: var(--el-bg-color-white) !important;
  }
}
.el-tabs {
  background: var(--el-bg-color-white) !important;
  
}
.el-pagination {
  .el-pager {
    li {
      background: var(--el-fill-color-light) !important;
      border: 1px solid var(--el-border-color) !important;
      color: var(--el-text-color-secondary) !important;
      &.is-active {
        border-color: var(--el-color-primary) !important;
        color: var(--el-text-color-primary) !important;
      }
    }
  }
  button {
    background: var(--el-fill-color-light) !important;
  }
}
.el-dialog {
  background: var(--el-bg-color-white) !important;
}
.el-table {
  background: var(--el-bg-color-white) !important;
  tr {
    background-color: var(--el-bg-color-white) !important;
    color: var(--el-text-color-regular) !important;
  }
}
.el-menu {
  background-color: var(--el-bg-color-white) !important;
}
.el-tag {
  &:not(.el-tag--dark) {
    background: var(--el-bg-color-tag) !important;
    border-color: var(--el-border-color-tag) !important;
  }
}
</style>