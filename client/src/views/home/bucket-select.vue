<template>
  <div class="bucket-title">选择存储桶</div>
  <div class="bucket-list">
    <el-tag
      v-for="(item, index) in buckets"
      :key="'bucket-' + index"
      size="large"
      type="info"
      :effect="item.id === habits.current.id ? 'dark' : ''"
      @click="toggleCurrentBucket(item)">
      {{ item.name }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup>
import Bucket from '@/types/Bucket';
import { BucketInter, HabitsInter } from '@/typings/interface';
import { BasicResponse, PageResponse } from '@/typings/req-res';
import { computed, Ref, ref } from 'vue';
interface Props {
  userHabits: HabitsInter
}

/**
 * 实例
 */
const bucket = new Bucket()
const props = withDefaults(defineProps<Props>(), {
  userHabits: () => ({
    link_format: 'URL'
  } as HabitsInter)
})
const emit = defineEmits(['update:userHabits'])

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
      const tmp = baseUrl && baseUrl.replace(/\$\{/g, '${obj.')
      obj.baseUrl = eval('`' + tmp + '`')
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        tag: item.tag,
        config_baseUrl: obj.baseUrl
      }
    })
  })
}
listGet()


/**
 * 逻辑处理
 */
// 切换当前图床
const toggleCurrentBucket = (item: BucketInter) => {
  // console.log('切换当前图床')
  habits.value.current = item
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
</style>