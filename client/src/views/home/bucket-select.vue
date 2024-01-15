<template>
  <div class="bucket-title">选择存储桶</div>
  <div class="bucket-list" v-if="buckets.length">
    <el-tag
      v-for="(item, index) in buckets"
      :key="'bucket-' + index"
      size="large"
      type="info"
      :effect="item.id === habits.current_bucket ? 'dark' : 'light'"
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
import useUserStore from '@/store/user';
import Bucket from '@/types/Bucket';
import Habits from '@/types/Habits';
import { BucketInter, HabitsInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { computed, Ref, ref } from 'vue';

interface Props {
  userHabits: HabitsInter
}

/**
 * 实例
 */
const bucket = new Bucket()
const habit = new Habits()
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
    visible: true,
    is_only_names: true
  }).then((res: PageResponse<BucketInter>) => {
    buckets.value = res.items
    userStore.updateUserBuckets(buckets.value)
  })
}
listGet()


/**
 * 逻辑处理
 */
// 切换当前图床
const toggleCurrentBucket = async (item: BucketInter) => {
  habits.value.current_bucket = item.id
  await habit.save({
    id: habits.value.id,
    current_bucket: habits.value.current_bucket
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/flex-layout.scss';
$color: var(--el-color-info);
$color-active: var(--el-color-white);
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
  color: var(--el-text-color-secondary);
  a {
    text-decoration: none;
    margin: 0 5px;
    color: var(--el-color-primary);
  }
}
</style>