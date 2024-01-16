<template>
  <div class="card-item">
    <div class="card-item-left">
      <div class="card-item-count">
        <span class="total-count">
          <!-- {{ formatCount(item.total) }} -->
          <count-up :startVal="0" :endVal="item.total" :duration="2"></count-up>
        </span>
        <span class="today-count" v-if="item.today !== 0" :style="{
          color: formatStyle(item.today)
        }">{{ formatTodayCount(item.today) }}</span>
      </div>
      <span class="card-item-label">
        {{ item.label }}
        <small v-if="item.unit">({{ item.unit }})</small>
      </span>
    </div>
    <div class="card-item-right">
      <el-icon :color="item.color" :size="40"><component :is="item.cover"></component></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CountUp from 'vue-countup-v3'
interface Props {
  item?: {
    total?: number
    today?: number
    label?: string
    bgcolor?: string
    cover?: string
    unit?: string // 单位
    color?: string // 颜色
  }
}
withDefaults(defineProps<Props>(), {
  item: () => ({
    total: 0,
    today: 0,
    label: '名称',
    bgcolor: '#ccc',
    cover: '',
    unit: '个',
    color: '#ccc'
  })
})

const formatCount = (count) => {
  return ('' + count).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
const formatTodayCount = (count) => {
  if (count > 0) {
    return '+' + count
  } else if (count <= 0) {
    return count
  }
}
const formatStyle = (count) => {
  if (count === 0) {
    return '#909399'
  } else if (count < 0) {
    return '#f56c6c'
  } else {
    return '#67c23a'
  }
}
</script>

<style lang="scss">
.card-item {
  width: 100%;
  height: 110px;
  background: var(--el-bg-color-white);
  border-radius: 4px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-item-right {
    width: 60px;
    height: 60px;
    margin-left: 10px;
    flex-shrink: 0;
    background: v-bind('item.bgcolor');
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
  }
  .card-item-left {
    flex: 1;
    color: var(--el-text-color-primary);
    .card-item-count {
      margin-bottom: 10px;
      display: flex;
      align-items: flex-end;
      .total-count {
        font-size: 26px;
      }
      .today-count {
        font-size: 14px;
        color: var(--el-color-primary);
        margin-left: 5px;
      }
    }
    .card-item-label {
      // color: #009688;
      // font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>