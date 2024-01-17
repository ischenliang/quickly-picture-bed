<template>
  <div :class="{ container: true, theme: theme }">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import key from 'keymaster'

import { nextTick, watch, ref } from 'vue';
import useUserStore from './store/user';
import Plugin from './types/Plugin';
import { PluginInter } from './typings/interface';
import { PluginLoadUrl } from './global.config';
import defaultTheme from './default-theme'

/**
 * 实例
 */
const userStore = useUserStore()
const plugin = new Plugin()
const theme = ref(false)


/**
 * 监听器
 */
watch(() => userStore.user_habits.data.shortKey, (val) => {
  nextTick(() => {
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
// 监测是否登录，若已登录则
watch(() => userStore.user_habits.data, (val) => {
  if (val.id && val.uid) {
    theme.value = true
    if (val.current_theme && val.current_theme.id && val.current_theme.plugin_id) {
      plugin.detail(val.current_theme.plugin_id).then((res: PluginInter) => {
        const { name, user_plugin: { version } } = res
        const url = `${PluginLoadUrl}${name}/${version}/files/dist/main.js`
        fetch(url).then(res => res.text()).then(async (res) => {
          const plugin = new Function(res)
          plugin()
          // @ts-ignore
          const myPlugin: any = window.MyPlugin
          const { name, config: { colors } } = myPlugin
          for (let key in colors) {
            document.documentElement.style.setProperty(key, colors[key]);
          }
        })
      })
    } else {
      const { config: { colors } } = defaultTheme
      for (let key in colors) {
        document.documentElement.style.setProperty(key, colors[key]);
      }
    }
  }
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="scss">
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
  &.theme {
    background: var(--el-fill-color-light);
  }
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

.layout-wrapper {
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
  // .el-tag {
  //   &:not(.el-tag--dark) {
  //     background: var(--el-bg-color-tag) !important;
  //     border-color: var(--el-border-color-tag) !important;
  //   }
  // }
}
</style>