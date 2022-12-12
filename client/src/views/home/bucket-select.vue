<template>
  <div class="bucket-title">选择存储桶</div>
  <div class="bucket-list" v-if="buckets.length">
    <el-tag
      v-for="(item, index) in buckets"
      :key="'bucket-' + index"
      size="large"
      type="info"
      :effect="item.id === habits.current.id ? 'dark' : 'light'"
      @click="toggleCurrentBucket(item)">
      {{ item.name }}
    </el-tag>
  </div>
  <div class="bucket-list" v-else>
    <p class="empty-bucket">
      暂无存储桶可选，请前往<router-link :to="'/bucket'">存储桶</router-link>页创建
    </p>
  </div>
</template>

<script lang="ts" setup>
import Bucket from '@/types/Bucket';
import Habits from '@/types/Habits';
import PluginManager from '@/typings/PluginManager';
import { BucketInter, HabitsInter, MyPlugin } from '@/typings/interface';
import { BasicResponse, PageResponse } from '@/typings/req-res';
import { computed, Ref, ref } from 'vue';
import useUserStore from '@/store/user';
import axios from 'axios';
import crypto from 'node:crypto'
import mime from 'mime-types'
interface Props {
  userHabits: HabitsInter
}

/**
 * 实例
 */
const bucket = new Bucket()
const habit = new Habits()
const pluginManager = new PluginManager()
const props = withDefaults(defineProps<Props>(), {
  userHabits: () => ({
    link_format: 'URL'
  } as HabitsInter)
})
const emit = defineEmits(['update:userHabits'])
const userStore = useUserStore()

/**
 * 变量
 */
const buckets: Ref<BucketInter[]> = ref([])
const habits = computed({
  get: () => props.userHabits,
  set: (val) =>  emit('update:userHabits', val)
})


/**
 * 数据获取
 */
const listGet = () => {
  bucket.find({
    visible: true
  }).then((res: PageResponse<BucketInter>) => {
    buckets.value = res.items.map(item => {
      const obj = JSON.parse(item.config)
      const { baseUrl } = obj
      // obj.baseUrl = baseUrl && baseUrl.replace(/\$\{(.*?)\}/g, (v, key) => {
      //   return obj[key]
      // })
      obj.baseUrl = baseUrl && baseUrl.replace(/\$\{((config).*?)\}/g, (v, key) => {
          const keys = key.split('.')
          if (keys[0] === 'config') {
            return obj[keys[1]]
          }
        })
      // 此处还需注册插件
      if (item.plugin) {
        // 第一步：将定义好的插件中的${config.xxx}替换成真实的数据(即全局config中的数据)
        const tmp = item.plugin.replace(/\$\{((config|file).*?)\}/g, (v, key) => {
          const keys = key.split('.')
          if (keys[0] === 'config') {
            return obj[keys[1]]
          }
        })

        // 第二步：将定义好的插件转成js对象
        const plugin: MyPlugin = new Function('return ' + tmp)()
        plugin.name = item.id

        // console.log(plugin.uploader.request({ filename: 'abc.test' }))
        pluginManager.register(plugin)
        // 第三步：为了解决直接调用axios报错问题，动态在uploader上挂载axios，然后才可以在内部使用this['axios']调用
        plugin.uploader.axios = axios
        plugin.uploader.crypto = crypto
        plugin.uploader.mime = mime
      }
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        tag: item.tag,
        config_baseUrl: obj.baseUrl,
        plugin: item.plugin
      }
    })
    // 将插件管理器存放到pinia中
    userStore.updatePluginManager(pluginManager)
  })
}
listGet()


/**
 * 逻辑处理
 */
// 切换当前图床
const toggleCurrentBucket = async (item: BucketInter) => {
  // console.log('切换当前图床')
  habits.value.current = item
  await habit.save({
    id: habits.value.id,
    current: habits.value.current
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
$color: #6c757d;
$color-active: #ffffff;
.bucket-title {
  font-size: 18px;
  margin-bottom: 15px;
}
.bucket-list {
  margin-left: -5px;
  .el-tag {
    height: 38px !important;
    padding: 0 15px;
    font-size: 16px;
    background: transparent;
    border: 1px solid $color;
    color: $color;
    margin-bottom: 8px;
    margin-left: 8px;
    cursor: pointer;
    &.el-tag--dark {
      background: $color;
      color: $color-active;
    }
  }
}
.empty-bucket {
  color: #909399;
  a {
    text-decoration: none;
    margin: 0 5px;
    color: #2d8cf0;
  }
}
</style>