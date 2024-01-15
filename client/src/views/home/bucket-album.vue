<template>
  <div class="bucket-title">选择相册</div>
  <div class="bucket-list" v-if="albums.length">
    <el-tag
      v-for="(item, index) in albums"
      :key="'bucket-' + index"
      size="large"
      type="info"
      :effect="item.id === habits.current_album ? 'dark' : 'light'"
      @click="toggleCurrentBucket(item.id)">
      {{ item.name }}
    </el-tag>
  </div>
  <div class="bucket-list" v-else>
    <p class="empty-bucket">
      暂无相册可选，请前往<router-link :to="'/albums'">相册</router-link>页创建
    </p>
  </div>
</template>

<script lang="ts" setup>
import Habits from '@/types/Habits';
import { AlbumInter, HabitsInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { computed, Ref, ref } from 'vue';
import Album from '@/types/Album';

interface Props {
  userHabits: HabitsInter
}

/**
 * 实例
 */
const album = new Album()
const habit = new Habits()
const props = withDefaults(defineProps<Props>(), {
  userHabits: () => ({
    link_format: 'URL'
  } as HabitsInter)
})
const emit = defineEmits(['update:userHabits'])

/**
 * 变量
 */
const albums: Ref<AlbumInter[]> = ref([])
const habits = computed({
  get: () => props.userHabits,
  set: (val) =>  emit('update:userHabits', val)
})


/**
 * 数据获取
 */
const listGet = () => {
  album.find({}).then((res: PageResponse<AlbumInter>) => {
    albums.value = [
      {
        id: 0,
        name: '图库'
      },
      ...res.items
    ]
    const flag = albums.value.some(el => el.id === habits.value.current_album)
    if (!flag) {
      habits.value.current_album = null
    }
  })
}
listGet()


/**
 * 逻辑处理
 */
// 切换当前图床
const toggleCurrentBucket = async (item: number) => {
  habits.value.current_album = item
  await habit.save({
    id: habits.value.id,
    current_album: item
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