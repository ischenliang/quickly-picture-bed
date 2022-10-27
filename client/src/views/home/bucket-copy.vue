<template>
  <div class="bucket-title">链接格式</div>
  <el-tabs v-model="habits.pasteStyle" type="border-card" class="bucket-copy-tabs" @tab-change="handleTabChange">
    <el-tab-pane v-for="(item, index) in linkTypesComputed" :key="'linkType-' + index" :label="item.label" :name="item.id">
      <div class="links-copy" @click="copyLink(item)">
        {{ getLinkValue(item) }}
        <span class="link-copy-btn">
          <el-icon><CopyDocument /></el-icon>
        </span>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { useCopyText, useCtxInstance } from '@/hooks/global';
import { HabitsInter, ImageInter } from '@/typings/interface';
import { computed, ref, Ref } from 'vue';
import { linkTypes, Link } from '@/global.config'
import useUserStore from '@/store/user';
import Habits from '@/types/Habits';
interface Props {
  userHabits: HabitsInter
}

/**
 * 实例
 */
const ctx = useCtxInstance()
const props = withDefaults(defineProps<Props>(), {
  userHabits: () => ({
    link_format: 'URL'
  } as HabitsInter)
})
const emit = defineEmits(['update:userHabits'])
const userStore = useUserStore()
const habit = new Habits()

/**
 * 变量
 */
const habits = computed({
  get: () => props.userHabits,
  set: (val) =>  emit('update:userHabits', val)
})

// 当前上传图片
const current = computed(() => {
  return userStore.currentImage
})
const linkTypesComputed = computed(() => {
  return linkTypes.value.map(item => {
    if (item.id === 'custom') {
      item.value = habits.value.link_format
    }
    return item
  })
})


/**
 * 逻辑处理
 */
// 获取指定类型的链接地址
const getLinkValue = (item: Link) => {
  const url =  current.value.img_preview_url
  const obj = {
    url: url ? url : '',
    filename: current.value.img_name
  }
  const tmp = item.value.replace(/\$\{/g, '${obj.')
  return eval('`' + tmp + '`')
}
// 复制链接
const copyLink = (item: Link) => {
  useCopyText(ctx, getLinkValue(item))
}

const handleTabChange = async (name) => {
  await habit.save({
    id: habits.value.id,
    pasteStyle: name
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
.bucket-title {
  font-size: 18px;
  margin-bottom: 15px;
  flex-shrink: 0;
}
.el-tabs {
  flex: 1;
}

</style>

<style lang="scss">
@import '@/styles/flex-layout.scss';
.bucket-copy-tabs {
  &.el-tabs {
    @include flex-layout(column);
    overflow: hidden;
    .el-tabs__header {
      background: #fff;
      flex-shrink: 0;
    }
    .el-tabs__content {
      flex: 1;
      overflow: hidden;
      .el-tab-pane {
        width: 100%;
        height: 100%;
        overflow: auto;
        .links-copy {
          width: 100%;
          // min-height: 100%;
          min-height: 80px;
          height: 100%;
          background: rgba(204,232,255,.5);
          border: 1px solid rgba(153,209,255,.57);
          border-radius: 4px;
          padding: 10px 15px;
          font-size: 14px;
          color: #747a80;
          cursor: pointer;
          word-break: break-all;
          position: relative;
          line-height: 20px;
          padding-right: 30px;
          .link-copy-btn {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            display: none;
          }
          &:hover {
            .link-copy-btn {
              display: block;
            }
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .el-tabs__item {
      margin-left: -1px;
      border-right: 1px solid #dcdfe6;
      &.is-active {
        font-weight: bold;
      }
    }
  }
}
</style>